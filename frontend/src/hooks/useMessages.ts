import { getMessages, getRoomMessages } from "@/services/messageApi"
import { Message } from "@/types/Message"
import { useCallback, useEffect, useState } from "react"

export const useMessages = (roomId?: string, enabled = true) => {
  const [messages, setMessages] = useState<Message[]>([])

  const loadMessages = useCallback(async () => {
    setMessages([]);
    
    try {
      const loaded = roomId ? await getRoomMessages(roomId) : await getMessages();
      setMessages(loaded);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  }, [roomId])

  useEffect(() => {
    if (enabled) {
      loadMessages();
    }
  }, [enabled, loadMessages]);

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