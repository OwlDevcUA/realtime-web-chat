import { getMessages, getRoomMessages } from "@/services/messageApi"
import { Message } from "@/types/Message"
import { useCallback, useEffect, useState } from "react"

export const useMessages = (roomId?: string) => {
  const [messages, setMessages] = useState<Message[]>([])

  const loadMessages = useCallback(async () => {
    setMessages([]);
    
    if (roomId) {
    const loadedMessages = await getRoomMessages(roomId);

    setMessages(loadedMessages);
  } else {
    const loadedMessages = await getMessages();

    setMessages(loadedMessages);
  }
  }, [roomId])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  const saveData = useCallback((message: Message) => {
  setMessages((prev) => {
    if (prev.some((m) => m.id === message.id)) {
      return prev;
    }
    return [...prev, message];
  });
}, []);

  return {
    messages,
    loadMessages,
    setMessages,
    saveData,
  }
}