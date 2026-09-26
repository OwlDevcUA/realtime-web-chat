import { getRoomMessages } from "@/services/messageApi";
import { checkUser, deleteRoom, joinRoom, leaveRoom, renameRoom } from "@/services/roomApi";
import { Message } from "@/types/Message";
import { Room } from "@/types/Room";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UseRoomItemOptions {
  room: Room;
  userId: string;
  onUpdate: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

export const useRoomItem = ({ room, userId, onUpdate, onDelete }: UseRoomItemOptions) => {
  const [input, setInput] = useState(room.name);
  const [isEditing, setIsEditing] = useState(false);
  const [roomMessages, setRoomMessages] = useState<Message[]>([]);
  const [userInRoom, setUserInRoom] = useState(false);
  const router = useRouter();

  const loadRoomData = useCallback(async () => {
    if (!room?.id || !userId) return;
    
          try {
            const [messages, userStatus] = await Promise.all([
              getRoomMessages(room.id),
              checkUser(userId, room.id),
            ]);
    
            setRoomMessages(messages);
            setUserInRoom(userStatus.isInRoom);
          } catch (error) {
            console.error(error);
          }
  }, [])

  useEffect(() => {
    loadRoomData()
  }, [room.id, userId])

  async function handleSaveRename(e: React.FormEvent) {
      e.preventDefault();
  
      if (!input.trim() || input === room.name) {
        setIsEditing(false);
        return;
      }
  
      const updatedRoom = await renameRoom(input.trim(), room.id);
  
      onUpdate(updatedRoom);
      setIsEditing(false);
    }
  
    async function handleDelete() {
      await deleteRoom(room.id);
      onDelete(room.id);
    }
  
    async function handleLeave() {
      const updatedRoom = await leaveRoom(userId, room.id);
      onUpdate(updatedRoom);
      setUserInRoom(false);
      router.push('/chat');
    }
  
    async function handleJoin() {
      const updatedRoom = await joinRoom(userId, room.id);
      onUpdate(updatedRoom);
      setUserInRoom(true);
      router.push(`/rooms/${room.id}`);
    }
  
  return {
    input,
    setInput,
    isEditing,
    setIsEditing,
    roomMessages,
    userInRoom,
    handleDelete,
    handleJoin,
    handleSaveRename,
    handleLeave,
  }
}