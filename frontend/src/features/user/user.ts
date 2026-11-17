import { User } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  accessToken: string | null; 
}

const initialState: UserState = {
  user: null,
  accessToken: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
     state.user = action.payload
    },
  },
})

export const { setUser } = userSlice.actions;