'use client';

import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { addRoom } from "@/features/room/rooms";
import { useRouter } from "next/navigation";

type Props = {
  onClose: (state: boolean) => void;
};

export const RoomCreateForm: React.FC<Props> = ({ onClose }) => {
  const router = useRouter();
  const [name, setName] = useState('');

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
    return;
  }

    try {
    const room = await dispatch(addRoom({ name: trimmed })).unwrap();

    onClose(false);
    router.push(`/rooms/${room.id}`);
  } catch (err) {
    console.error('Failed to create room', err); 
  }
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
