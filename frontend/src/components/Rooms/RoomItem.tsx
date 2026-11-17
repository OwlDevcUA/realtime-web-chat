'use client';

import type { Room } from "../../types/Room"
import './Rooms.scss';
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Message } from "@/types/Message";
import { getRoomMessages } from "@/services/messageApi";
import { joinRoom, leaveRoom } from "@/services/roomApi";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { changeRoomName, checkUserInRoom, loadRooms, removeRoom, roomsSlice } from "@/features/room/rooms";
import { useRouter } from "next/navigation";

type Props = {
  room: Room;
}

export const RoomItem: React.FC<Props> = ({ room }) => {
  const router = useRouter();
  const [roomMessages, setRoomMessages] = useState<Message[]>([]);
  const [isEditing, setIsEditing] = useState(false)
  const [input, setInput] = useState(room.name)

  const { user } = useAppSelector(state => state.user)
  const userInRoom = useAppSelector((state) =>
    state.rooms.joinedRoomIds.includes(room.id)
  );

  const dispatch = useAppDispatch();

  const loadRoomData = useCallback(async () => {
  if (!room?.id || !user?.id) return;
  
  try {
    dispatch(checkUserInRoom({ userId: user.id, roomId: room.id }));
    const messages = await getRoomMessages(room.id);
    setRoomMessages(messages);
  } catch (error) {
    console.error(error);
  }
}, [room.id, user?.id, dispatch]);
  
    useEffect(() => {
      loadRoomData()
    }, [loadRoomData])
  
  useEffect(() => {
    if (isEditing) {
      setInput(room.name);
      }
    }, [room.name, isEditing])

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!input.trim() || input === room.name) {
      setIsEditing(false);
      return;
    }

    dispatch(changeRoomName({ newName: input.trim(), roomId: room.id }));
    setIsEditing(false);
  }

  async function handleDelete() {
    await dispatch(removeRoom(room.id))
    router.push('/');
  }
  
  async function handleLeave() {
    if (user?.id) {
      await leaveRoom(user?.id, room.id) 
      dispatch(roomsSlice.actions.setJoinedStatus({ roomId: room.id, isInRoom: false }));
    }
    router.push('/');
  }
  
  async function handleJoin() {
    if (user?.id) {
      await joinRoom(user?.id, room.id)
      dispatch(roomsSlice.actions.setJoinedStatus({ roomId: room.id, isInRoom: true }));
    }
    router.push(`/rooms/${room.id}`);
  }

  const roomLastMessage = roomMessages[roomMessages.length - 1];

  return (
    <div className="room">
      {isEditing ? (
        <form onSubmit={handleRename} className="room__renameForm">
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
          <Link
            href={`/rooms/${room.id}`}
            aria-disabled={!userInRoom}
            style={{ pointerEvents: !userInRoom ? 'none' : 'auto' }}
            onClick={(e) => {
            if (!userInRoom) e.preventDefault();
        }}>
          <h2 className="room__name">{room.name}</h2>
          <p className="room__text">{roomLastMessage?.text || 'No messages yet'}</p>
          
        </Link>
      )}
      
      {userInRoom ? (
        <div>
          {!isEditing && (
        <button className="room__edit" onClick={() => setIsEditing(true)}>
          ✏️
        </button>
      )}
          <button className="room__delete" onClick={handleDelete}>❌</button>
          <button className="room__leave" onClick={handleLeave}>➡️</button>
        </div>
      ) : (
        <button className="room__join" onClick={handleJoin}>🚪</button>
      )}
    </div>
  )
}
