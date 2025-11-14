// backend/src/models/Message.ts
export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: string[];
  ingredients?: string[]; 
  timestamp: Date;
}

// backend/src/models/Chat.ts
export interface Chat {
  id: string;
  messages: Message[];
  identifiedIngredients: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeRequest {
  ingredients: string[];
  preferences?: {
    dietary?: string[];
    cuisine?: string;
    difficulty?: string;
    maxTime?: number;
  };
  prompt?: string;
}
