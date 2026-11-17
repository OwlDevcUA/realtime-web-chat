'use client';

import { Message } from "@/types/Message";
import React, { useEffect } from "react";


type Props = {
  roomId?: string;
  onData: (data: Message) => void;
}

export const DataLoader: React.FC<Props> = ({ onData, roomId }) => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      if (roomId) {
        socket.send(JSON.stringify({ type: 'JOIN_ROOM', roomId }))
      }
    };

    socket.addEventListener('message', (event: { data: string }) => {
      onData(JSON.parse(event.data) as Message)
    })

    return () => socket.close();
  }, [onData, roomId])
}
