import { userService } from 'src/services/userService.js';
import { messageService } from '../services/messageService.js';

const getMessages = async (req, res) => {
  const roomId = req.params.roomId || null;

  const messages = await messageService.getMessages(roomId);

  return res.json(messages);
};

const sendMessage = async (req, res) => {
  const { text } = req.body;
  const roomId = req.params.roomId;
  const { id: userId } = req.user;

  const message = await messageService.addMessage(
    text,
    roomId,
    userId,
  );

  req.app.get('messageEmitter').emit('message', message);

  res.status(201).json(message);
};

export const messageController = {
  getMessages,
  sendMessage,
};
