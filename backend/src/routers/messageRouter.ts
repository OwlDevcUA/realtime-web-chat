import express from 'express';
import { messageController } from '../controllers/messageController.js';
import { authMiddleware } from 'src/midlwares/authMidleware.js';
import { catchError } from 'src/midlwares/catchError.js';

export const messageRouter = express.Router();

messageRouter.get('/chat',
  catchError(authMiddleware),
  catchError(messageController.getMessages));

messageRouter.get('/rooms/:roomId',
  catchError(authMiddleware),
  catchError(messageController.getMessages));

messageRouter.post('/chat',
  catchError(authMiddleware),
  catchError(messageController.sendMessage));

messageRouter.post('/rooms/:roomId',
  catchError(authMiddleware),
  catchError(messageController.sendMessage));
