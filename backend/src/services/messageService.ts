import { User } from 'src/modules/User.js';
import { Message } from '../modules/Message.js';
import dayjs from 'dayjs';

async function getMessages(roomId) {
  const whereCondition = roomId ? { roomId } : { roomId: null };

  return Message.findAll({
    where: whereCondition
  });
}


async function addMessage(text, roomId, userId) {
  const created = await Message.create({
    time: dayjs().format('HH:mm'),
    text,
    roomId: roomId || null,
    userId,
  });

  return Message.findByPk(created.id);
}

export const messageService = {
  getMessages,
  addMessage,
};
