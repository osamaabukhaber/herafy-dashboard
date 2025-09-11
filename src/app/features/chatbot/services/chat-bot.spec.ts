import { TestBed } from '@angular/core/testing';

import { ChatBot } from './chat-bot';

describe('ChatBot', () => {
  let service: ChatBot;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatBot);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
