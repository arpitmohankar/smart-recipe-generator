// src/routes/chatRoutes.ts
import { Router } from 'express';
import { createChat, sendMessage, getChatHistory } from '../controllers/chatController';

const router = Router();

router.post('/create', createChat);
router.post('/:chatId/message', sendMessage);
router.get('/:chatId/history', getChatHistory);

export default router;
