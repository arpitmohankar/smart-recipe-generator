// src/controllers/chatController.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { processRecipeRequest } from '../services/recipeService';
import { Message } from '../models/Message';

const chatSessions = new Map<string, Message[]>();

export const createChat = (req: Request, res: Response) => {
  const chatId = uuidv4();
  chatSessions.set(chatId, []);
  
  res.json({
    success: true,
    chatId,
    message: 'Chat session created'
  });
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { message, ingredients, preferences } = req.body;

    if (!chatSessions.has(chatId)) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    const messages = chatSessions.get(chatId)!;
    
    const userMessage: Message = {
      id: uuidv4(),
      chatId,
      role: 'user',
      content: message,
      ingredients: ingredients,
      timestamp: new Date()
    };
    messages.push(userMessage);

    let assistantResponse: string;

    if (ingredients && ingredients.length > 0) {
      assistantResponse = await processRecipeRequest({
        ingredients,
        dietary: preferences?.dietary,
        cuisine: preferences?.cuisine,
        difficulty: preferences?.difficulty
      });
    } else {
      assistantResponse = "Please upload images of your ingredients or tell me what ingredients you have available.";
    }

    const assistantMessage: Message = {
      id: uuidv4(),
      chatId,
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date()
    };
    messages.push(assistantMessage);

    res.json({
      success: true,
      message: assistantMessage
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing message'
    });
  }
};

export const getChatHistory = (req: Request, res: Response) => {
  const { chatId } = req.params;
  
  if (!chatSessions.has(chatId)) {
    return res.status(404).json({
      success: false,
      message: 'Chat session not found'
    });
  }

  res.json({
    success: true,
    messages: chatSessions.get(chatId)
  });
};
