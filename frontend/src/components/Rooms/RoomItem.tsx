'use client';

import type { Room } from "../../types/Room"
import './Rooms.scss';
import Link from "next/link";
import { useRoomItem } from "@/hooks/useRoomItem";

type Props = {
  room: Room;
  userId: string;
  onDelete: (roomId: string) => void;
  onUpdate: (room: Room) => void;
}

export const RoomItem: React.FC<Props> = ({ room, userId, onUpdate, onDelete }) => {

  const {
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
  } = useRoomItem({room, userId, onUpdate, onDelete});
 
  const roomLastMessage = roomMessages[roomMessages.length - 1];

  return (
    <div className="room">
      {isEditing ? (
        <form onSubmit={handleSaveRename} className="room__renameForm">
          <input
            type="text"
            className="room__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="room__btn">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <Link href={`/rooms/${room.id}`}>
          <h2 className="room__name">{room.name}</h2>
          <p className="room__text">{roomLastMessage?.text || 'No messages yet'}</p>
        </Link>
      )}
      {!isEditing && (
        <button className="room__edit" onClick={() => setIsEditing(true)}>
          ✏️
        </button>
      )}

      <button className="room__delete" onClick={handleDelete}>❌</button>
      {userInRoom ? (
        <button className="room__leave" onClick={handleLeave}>➡️</button>
      ) : (
        <button className="room__join" onClick={handleJoin}>🚪</button>
      )}
    </div>
  )
}
