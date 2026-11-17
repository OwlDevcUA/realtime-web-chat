import express from 'express';
import { roomController } from '../controllers/roomController.js';
import { authMiddleware } from 'src/midlwares/authMidleware.js';
import { catchError } from 'src/midlwares/catchError.js';

export const roomRouter = express.Router();

roomRouter.get('/rooms',
  catchError(authMiddleware), 
  catchError(roomController.getRooms));

roomRouter.post('/rooms', 
  catchError(authMiddleware), 
  catchError(roomController.createRoom));
  
roomRouter.patch('/rooms', 
  catchError(authMiddleware), 
  catchError(roomController.renameRoom));
  
roomRouter.delete('/rooms', 
  catchError(authMiddleware), 
  catchError(roomController.deleteRoom));
  
roomRouter.patch('/rooms/join', 
  catchError(authMiddleware), 
  catchError(roomController.joinRoom));
  
roomRouter.patch('/rooms/leave', 
  catchError(authMiddleware), 
  catchError(roomController.leaveRoom));
  
roomRouter.get('/rooms/:roomId/users/:userId', 
  catchError(authMiddleware), 
  catchError(roomController.isUserInRoom));
