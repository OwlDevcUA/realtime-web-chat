/* eslint-disable no-console */
'use strict';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { EventEmitter } from 'node:events';

import './modules/associations.js';
import { sequelize } from './utils/db.js';
import { messageRouter } from './routers/messageRouter.js';
import { roomRouter } from './routers/roomRouter.js';
import { CustomWebSocket } from './types/CustomWebSocket.js';
import cookieParser from 'cookie-parser';
import { profileRouter } from './routers/profileRouter.js';
import { authRouter } from './routers/authRouter.js';
import { authMiddleware } from './midlwares/authMidleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(cookieParser())
app.use(express.json());

app.use(authRouter);
app.use(authMiddleware);
app.use(messageRouter);
app.use(roomRouter);
app.use(profileRouter);

const startApp = async () => {
  try {
    await sequelize.sync({ force: true });

    const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  }); 

    const wss = new WebSocketServer({ server });
    const messageEmitter = new EventEmitter();

    messageEmitter.on('message', (data) => {
      const clients = wss.clients as Set<CustomWebSocket>

      if (data.roomId) {
        for (const client of clients) {
          if (client.roomId === data.roomId) {
            client.send(JSON.stringify(data));
          }
        }

        return;
      }

      for (const client of clients) {
        if (!client.roomId) {
          client.send(JSON.stringify(data));
        }
      }
    });

    app.set('messageEmitter', messageEmitter);

    wss.on('connection', (client: CustomWebSocket) => {
      console.log('A new client connected');

      client.on('message', (rawData) => {
        const data = JSON.parse(rawData.toString());

        if (data.type === 'JOIN_ROOM') {
          client.roomId = data.roomId;
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

startApp();
