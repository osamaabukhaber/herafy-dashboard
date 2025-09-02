import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, TrackByFunction } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { IChat, IChatMessage } from '../../../../models/chat-model/ichat';
import { ChatBot } from '../../services/chat-bot.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

export interface ChatSettings {
  model: string;
  temperature?: number;
  maxTokens?: number;
  streamResponse?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  // Form management
  chatForm !: FormGroup;
  settingsForm !: FormGroup;

  // Chat state
  messages: IChatMessage[] = [];
  currentSession: ChatSession | null = null;
  chatSessions: ChatSession[] = [];

  // UI state
  isLoading: boolean = false;
  isTyping: boolean = false;
  isDarkMode: boolean = false;
  showSettings: boolean = false;
  showSidebar: boolean = false;

  // Statistics
  messageCount: number = 0;
  sessionStartTime: Date = new Date();

  // Error handling
  lastError: string | null = null;
  retryCount: number = 0;
  maxRetries: number = 3;

  // Cleanup
  private destroy$ = new Subject<void>();

  // Available models and settings
  availableModels = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
    { id: 'claude-3', name: 'Claude-3', description: 'Anthropic\'s latest model' }
  ];
  new !: Date;
  constructor(
    private chatApiService: ChatBot,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.initializeForms();
    this.loadUserPreferences();
  }

  ngOnInit(): void {
    this.initializeChat();
    this.setupFormValidation();
    this.loadChatHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.saveChatHistory();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private initializeForms(): void {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4000)]],
      model: ['gpt-3.5-turbo', Validators.required]
    });

    this.settingsForm = this.fb.group({
      temperature: [0.7, [Validators.min(0), Validators.max(2)]],
      maxTokens: [2048, [Validators.min(1), Validators.max(4096)]],
      streamResponse: [true],
      saveHistory: [true],
      darkMode: [false]
    });
  }

  private setupFormValidation(): void {
    // Auto-save settings on change
    this.settingsForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(settings => {
        this.saveUserPreferences(settings);
        this.isDarkMode = settings.darkMode;
      });
  }

  private initializeChat(): void {
    this.currentSession = this.createNewSession();
    this.addWelcomeMessage();
  }

  private createNewSession(): ChatSession {
    return {
      id: this.generateSessionId(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private addWelcomeMessage(): void {
    const welcomeMessage: IChatMessage = {
      role: 'assistant',
      content: '👋 Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    };
    this.addMessage(welcomeMessage);
  }

  // Main message sending logic
  async sendMessage(): Promise<void> {
    if (!this.isValidMessage()) return;

    const messageContent = this.chatForm.get('message')?.value?.trim();
    if (!messageContent) return;

    try {
      // Add user message
      const userMessage = this.createUserMessage(messageContent);
      this.addMessage(userMessage);

      // Clear input and show loading
      this.chatForm.patchValue({ message: '' });
      this.setLoadingState(true);

      // Add typing indicator
      this.showTypingIndicator();

      // Send to API
      await this.sendToAPI(messageContent);

    } catch (error) {
      console.error('Error sending message:', error);
      this.handleSendError(error);
    } finally {
      this.setLoadingState(false);
      this.hideTypingIndicator();
    }
  }

  private async sendToAPI(content: string): Promise<void> {
    const apiBody = {
      messages: [{ content }],
      model: this.chatForm.get('model')?.value,
      temperature: this.settingsForm.get('temperature')?.value,
      max_tokens: this.settingsForm.get('maxTokens')?.value
    };

    return new Promise((resolve, reject) => {
      this.chatApiService.sendMessage2(apiBody)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.handleAPISuccess(response);
            resolve();
          },
          error: (error: any) => {
            this.handleAPIError(error);
            reject(error);
          }
        });
    });
  }

  private handleAPISuccess(response: any): void {
    this.retryCount = 0;
    this.lastError = null;

    const assistantMessage: IChatMessage = {
      role: 'assistant',
      content: this.formatAPIResponse(response),
      timestamp: new Date(),
      metadata: {
        sources: response.sources,
        confidence: response.confidence,
        model: this.chatForm.get('model')?.value
      }
    };

    this.addMessage(assistantMessage);
    this.updateSessionTitle();
  }

  private handleAPIError(error: any): void {
    console.error('API Error:', error);

    let errorMessage = 'I apologize, but I encountered an error. Please try again.';

    if (error.status === 429) {
      errorMessage = '⏳ I\'m receiving too many requests. Please wait a moment and try again.';
    } else if (error.status === 500) {
      errorMessage = '🔧 There seems to be a server issue. Please try again in a few moments.';
    } else if (error.status === 0) {
      errorMessage = '🌐 Please check your internet connection and try again.';
    }

    const errorResponse: IChatMessage = {
      role: 'assistant',
      content: errorMessage,
      timestamp: new Date(),
      isError: true
    };

    this.addMessage(errorResponse);
    this.lastError = error.message || 'Unknown error occurred';
  }

  private handleSendError(error: any): void {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => {
        this.sendMessage();
      }, 1000 * this.retryCount);
    } else {
      this.handleAPIError(error);
    }
  }

  // Message management
  private createUserMessage(content: string): IChatMessage {
    return {
      role: 'user',
      content: content,
      timestamp: new Date()
    };
  }

  private addMessage(message: IChatMessage): void {
    if (!this.currentSession) return;

    this.currentSession.messages.push(message);
    this.currentSession.updatedAt = new Date();
    this.cdr.detectChanges();
    this.messageCount++;
    this.cdr.detectChanges();
  }

  private formatAPIResponse(response: any): string {
    console.log('API Response:', response);
    let formattedResponse = response.answer || response.content || response.message || '';

    // if (response.sources && response.sources.length > 0) {
    //   formattedResponse += '\n\n📚 **Sources:**\n';
    //   response.sources.forEach((source: string, index: number) => {
    //     formattedResponse += `${index + 1}. ${source}\n`;
    //   });
    // }

    return formattedResponse;
  }

  // UI Interactions
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onMessageInput(): void {
    // Auto-resize textarea
    if (this.messageInput?.nativeElement) {
      const element = this.messageInput.nativeElement;
      element.style.height = 'auto';
      element.style.height = Math.min(element.scrollHeight, 120) + 'px';
    }
  }

  // Loading and typing indicators
  private setLoadingState(loading: boolean): void {
    this.isLoading = loading;
  }

  private showTypingIndicator(): void {
    this.isTyping = true;
    const typingMessage: IChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    this.addMessage(typingMessage);
  }

  private hideTypingIndicator(): void {
    this.isTyping = false;
    if (this.currentSession) {
      this.currentSession.messages = this.currentSession.messages.filter(msg => !msg.isTyping);
      this.messages = [...this.currentSession.messages];
      this.cdr.detectChanges();
    }
  }

  // Validation
  private isValidMessage(): boolean {
    return this.chatForm.valid && !this.isLoading;
  }

  // Session management
  newChat(): void {
    this.saveChatHistory();
    this.currentSession = this.createNewSession();
    this.messages = [];
    this.messageCount = 0;
    this.sessionStartTime = new Date();
    this.addWelcomeMessage();
  }

private updateSessionTitle(): void {
  if (!this.currentSession || this.currentSession.messages.length < 2) return;

  const firstUserMessage = this.currentSession.messages.find(msg => msg.role === 'user');
  if (firstUserMessage) {
    this.currentSession.title = firstUserMessage.content.substring(0, 50) +
      (firstUserMessage.content.length > 50 ? '...' : '');
    this.cdr.detectChanges();
  }
}

  // Chat history
  private loadChatHistory(): void {
    try {
      const saved = localStorage.getItem('chatbot-sessions');
      if (saved) {
        this.chatSessions = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }

  private saveChatHistory(): void {
    try {
      if (this.currentSession && this.settingsForm.get('saveHistory')?.value) {
        const existingIndex = this.chatSessions.findIndex(s => s.id === this.currentSession!.id);
        if (existingIndex >= 0) {
          this.chatSessions[existingIndex] = this.currentSession;

        } else {
          this.chatSessions.unshift(this.currentSession);
        }

        // Keep only last 50 sessions
        this.chatSessions = this.chatSessions.slice(0, 50);

        localStorage.setItem('chatbot-sessions', JSON.stringify(this.chatSessions));
      }
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  loadSession(session: ChatSession): void {
    this.saveChatHistory();
    this.currentSession = { ...session };
    this.messages = [...session.messages];
    this.cdr.detectChanges();
  }

  deleteSession(sessionId: string, event: Event): void {
    event.stopPropagation();
    this.chatSessions = this.chatSessions.filter(s => s.id !== sessionId);
    localStorage.setItem('chatbot-sessions', JSON.stringify(this.chatSessions));
  }

  // User preferences
  private loadUserPreferences(): void {
    try {
      const saved = localStorage.getItem('chatbot-preferences');
      if (saved) {
        const preferences = JSON.parse(saved);
        this.settingsForm.patchValue(preferences);
        this.isDarkMode = preferences.darkMode || false;
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }

  private saveUserPreferences(settings: any): void {
    try {
      localStorage.setItem('chatbot-preferences', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  // Utility methods
  private scrollToBottom(): void {
    try {
      if (this.chatContainer?.nativeElement) {
        const element = this.chatContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Format methods for template
  formatMessageContent(content: string): string {
    if (!content) return '';

    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-500 hover:underline">$1</a>');
  }

  formatTimestamp(timestamp: Date): string {
    if (!(timestamp instanceof Date)) {
      timestamp = new Date(timestamp);
    }

    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  trackByMessageIndex: TrackByFunction<IChatMessage> = (index: number, message: IChatMessage) => {
    return `${message?.timestamp?.getTime()}_${index}`;
  };

  // Export functionality
  exportChat(): void {
    if (!this.currentSession) return;

    const exportData = {
      sessionInfo: {
        id: this.currentSession.id,
        title: this.currentSession.title,
        createdAt: this.currentSession.createdAt,
        messageCount: this.messages.length,
        model: this.chatForm.get('model')?.value
      },
      messages: this.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      })),
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-${this.currentSession.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  // Settings and preferences
  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.settingsForm.patchValue({ darkMode: this.isDarkMode });
  }

  clearAllData(): void {
    if (confirm('Are you sure you want to clear all chat history and preferences? This action cannot be undone.')) {
      localStorage.removeItem('chatbot-sessions');
      localStorage.removeItem('chatbot-preferences');
      this.chatSessions = [];
      this.newChat();
    }
  }

  // Getters for template
  get messageControl() {
    return this.chatForm.get('message');
  }

  get isMessageValid(): boolean {
    return this.messageControl?.valid || false;
  }

  get currentModel(): string {
    return this.chatForm.get('model')?.value || 'gpt-3.5-turbo';
  }

  get sessionDuration(): string {
    const duration = Date.now() - this.sessionStartTime.getTime();
    const minutes = Math.floor(duration / 60000);
    return `${minutes}m`;
  }
}
