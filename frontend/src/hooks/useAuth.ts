import { setUser } from "@/features/user/user";
import { useAppDispatch, useAppSelector } from "./hooks";
import { login, logout } from "@/services/authApi";
import { setAccessToken } from "@/services/api";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const authState = useAppSelector((state) => state.user);

  async function signIn(email: string, password: string) {
    dispatch(setUser(await login(email, password)));
  }

  async function signOut() {
    await logout();
    dispatch(setUser(null))
    setAccessToken(null);
  }

  return { user, signIn, signOut };
}