'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import './Username.scss';
import { useAppDispatch } from '@/hooks/hooks';
import { setUser } from '@/features/user/user';
import { activation } from '@/services/authApi';

export const ActivationPage: React.FC = () => {
  const params = useParams();
  const activationToken = params?.activationToken as string | undefined;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    if (!activationToken) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await activation(activationToken);

      dispatch(setUser(user)); 
      router.push('/');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Activation link is invalid or has already been used');
      } else {
        setError(err instanceof Error ? err.message : 'Activation failed');
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="usernameForm">
      <p className="usernameForm__label">Click the button to activate your account.</p>
      {error && <p className="usernameForm__error">{error}</p>}
      <button
        type="button"
        className="usernameForm__btn"
        onClick={handleActivate}
        disabled={isLoading || !activationToken}
      >
        {isLoading ? 'Activating...' : 'Activate'}
      </button>
    </div>
  );
};