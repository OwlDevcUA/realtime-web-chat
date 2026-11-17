'use client';

import React, { useState } from 'react';
import './Username.scss';
import { useAppDispatch } from '@/hooks/hooks';
import { setUser } from '@/features/user/user';
import { login } from '@/services/authApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [values, setValues] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await login(values.email.trim(), values.password);
      dispatch(setUser(user));
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <form className="usernameForm" onSubmit={handleSubmit}>
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
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        required
      />
      {error && <p className="usernameForm__error">{error}</p>}
      <button type="submit" className="usernameForm__btn" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign in'}
      </button>
      <Link href={'/register'} type="button" className="usernameForm__link">
        No account yet? Sign up
      </Link>
    </form>
  );
};