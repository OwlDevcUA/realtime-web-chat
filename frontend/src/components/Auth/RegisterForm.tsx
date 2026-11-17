'use client';

import React, { useState } from 'react';
import './Username.scss';
import { register } from '@/services/authApi';
import Link from 'next/link';

export const RegisterForm: React.FC = () => {
  const [values, setValues] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register(values.username.trim(), values.email.trim(), values.password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cannot create a user');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="usernameForm">
        <p className="usernameForm__label">Check your email to activate your account.</p>
        <Link href={'/login'} type="button" className="usernameForm__btn">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="usernameForm" onSubmit={handleSubmit}>
      <p className="usernameForm__label">Username:</p>
      <input
        className="usernameForm__input"
        name="username"
        type="text"
        value={values.username}
        onChange={handleChange}
        required
      />
      <p className="usernameForm__label">Email:</p>
      <input
        className="usernameForm__input"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        required
      />
      <p className="usernameForm__label">Password:</p>
      <input
        className="usernameForm__input"
        name="password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
        required
      />
      {error && <p className="usernameForm__error">{error}</p>}
      <button type="submit" className="usernameForm__btn" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign up'}
      </button>
      <Link href={'/login'} type="button" className="usernameForm__link">
        Already have an account? Sign in
      </Link>
    </form>
  );
};