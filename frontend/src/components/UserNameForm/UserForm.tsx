'use client';

import React, { useState } from "react"
import './Username.scss';
import { saveUser } from "@/services/userApi";
import type { User } from "@/types/User";
import { useUser } from "@/hooks/useUser";

export const UsernameForm: React.FC = () => {
  const [input, setInput] = useState('');

  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    const user: User = await saveUser(input);
    localStorage.setItem('userId', user.id);

    setUser(user);
  }

  return (
    <form className="usernameForm" onSubmit={handleSubmit}>
      <p className="usernameForm__label">Enter the username:</p>
      <input
        className="usernameForm__input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="usernameForm__btn">Submit</button>
    </form>
  )
}
