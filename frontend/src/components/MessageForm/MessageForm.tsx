'use client';

import type React from "react";
import { useState } from "react";
import { postMessage, postRoomMessage } from "@/services/messageApi";
import './MessageForm.scss'
import type { Message } from "@/types/Message";
import { useMessages } from "@/hooks/useMessages";
import { useAppSelector } from "@/hooks/hooks";

type Props = {
  roomId?: string
  onSet: (data: Message) => void;
}

export const MessageForm: React.FC<Props> = ({ roomId, onSet }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);


  const { user } = useAppSelector(state => state.user)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = text.trim();

    if (!text.trim() || !user?.username) {
      console.log(user);
      return;
    }

    
     setError(null);

    try {
      const message = roomId
        ? await postRoomMessage( trimmed, roomId )
        : await postMessage(trimmed);

      onSet(message);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }

  return (
    <form className="messageForm" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Type a message..."
        className="messageForm__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="messageForm__send" type="submit">Send</button>
    </form>
  )
}
