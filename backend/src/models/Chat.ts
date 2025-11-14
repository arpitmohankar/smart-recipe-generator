// src/models/Chat.ts
export interface Chat {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// src/models/Message.ts
export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: string[];
  ingredients?: string[];
  timestamp: Date;
}
