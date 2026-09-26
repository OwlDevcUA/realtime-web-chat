'use client';

import React, { useState } from "react"
import { createRoom } from "@/services/roomApi";
import type { Room } from "@/types/Room";
import { useRooms } from "@/hooks/useRooms";

type Props = {
  userId: string;
  onSet: (room: Room) => void;
  onClose: (isOpen: boolean) => void;
}

export const RoomCreateForm: React.FC<Props> = ({ userId, onSet, onClose }) => {
  const [name, setName] = useState('');
  const { loadRooms } = useRooms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const room = await createRoom(name, userId);
    onSet(room);
    onClose(false);
    loadRooms()
  }

  return (
    <form className="createRoom" onSubmit={handleSubmit}>
      <p className="createRoom__label">Enter the name:</p>
      <input
        className="createRoom__input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="createRoom__btn" type="submit">Create</button>
    </form>
  )
}
