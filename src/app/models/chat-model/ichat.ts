export interface IChatMessage {
  role: string;
  content: string;
  timestamp?: Date;
  isTyping ?:boolean;
  isError ?:boolean;
  metadata ?: {
        sources: string,
        confidence: string,
        model: string
      }
}

export interface IChat {
  model:string,
  role: string;
  content: string;
}
