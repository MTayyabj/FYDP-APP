export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

export interface ChatbotService {
  sendMessage(message: string): Promise<ChatMessage>;
  getConversationHistory(): Promise<ChatMessage[]>;
  getSuggestedPrompts(): string[];
}
