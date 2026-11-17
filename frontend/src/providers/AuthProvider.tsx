'use client';

import { setUser } from "@/features/user/user";
import { useAppDispatch } from "@/hooks/hooks";
import { refresh } from "@/services/authApi";
import React, { useEffect, useRef, useState } from "react";

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const dispatch = useAppDispatch();
  const refreshStarted = useRef(false);
  const [ready, setReady] = useState(false)

  useEffect(() => { 
      if (ready || refreshStarted.current) return;
      refreshStarted.current = true;
  
      refresh()
        .then(user => dispatch(setUser(user)))
        .catch(() => dispatch(setUser(null)))
        .finally(() => setReady(true))
  }, [dispatch, ready])
  
  return <>{children}</>
}