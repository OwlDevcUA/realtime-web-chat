import { getUser } from "@/services/userApi";
import { User } from "@/types/User";
import { useCallback, useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      setUser(null);
      setIsLoading(false);
      return;
    }
  
    try {
      const user = await getUser(userId);
      setUser(user);
    } catch (error) {
    console.error(error);
    localStorage.removeItem('userId');
    setUser(null);
    } finally {
    setIsLoading(false);
  }  
  }, [])

  useEffect(() => {
    loadUser()
  }, [])

  return {
    user,
    isLoading,
    setIsLoading,
    setUser,
  }
}