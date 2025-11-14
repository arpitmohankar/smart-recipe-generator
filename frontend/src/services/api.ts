/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance (NO DEFAULT CONTENT-TYPE)
const api = axios.create({
  baseURL: API_BASE_URL
});

// ---------- Types ----------
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ingredients?: string[];
  timestamp: string | Date;  // FIXED
}

export interface ChatResponse {
  success: boolean;
  message?: Message;
  chatId?: string;
  ingredients?: string[];
  messages?: Message[];
}

// ---------- CHAT API ----------
export const chatAPI = {
  createChat: async (): Promise<string> => {
    const res = await api.post<ChatResponse>('/chat/create');
    return res.data.chatId ?? '';
  },

  sendMessage: async (
    chatId: string,
    message: string,
    ingredients?: string[],
    preferences?: any
  ): Promise<Message> => {
    const res = await api.post<ChatResponse>(`/chat/${chatId}/message`, {
      message,
      ingredients,
      preferences
    });

    if (!res.data.message) {
      throw new Error("Chat API returned no message.");
    }

    return res.data.message;
  },

  getChatHistory: async (chatId: string): Promise<Message[]> => {
    const res = await api.get<ChatResponse>(`/chat/${chatId}/history`);
    return res.data.messages ?? [];
  }
};

// ---------- IMAGE API ----------
export const imageAPI = {
  analyzeImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    // ❗ DO NOT manually set Content-Type, axios handles it automatically
    const res = await api.post('/images/analyze', formData);

    return res.data.ingredients ?? [];
  }
};
