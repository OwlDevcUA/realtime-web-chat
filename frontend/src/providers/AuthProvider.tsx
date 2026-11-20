'use client';

import { Loader } from "@/components/Loader";
import { setUser } from "@/features/user/user";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { refresh } from "@/services/authApi";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const PUBLIC_ROUTES = ['/login', '/register', '/activate'];

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const dispatch = useAppDispatch();
  const refreshStarted = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.user);

  const [ready, setReady] = useState(false)

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  useEffect(() => { 
      if (ready || refreshStarted.current) return;
      refreshStarted.current = true;
  
      refresh()
        .then(user => dispatch(setUser(user)))
        .catch(() => dispatch(setUser(null)))
        .finally(() => setReady(true))
  }, [dispatch, ready])

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user && !isPublicRoute) {
      router.replace('/login')
    }

    if (user && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
      router.replace('/');
    }
  }, [ready, user, isPublicRoute, pathname, router])

  if (!ready) {
    return <Loader />
  }

  if (!user && !isPublicRoute) {
    return null;
  }
  
  return <>{children}</>
}