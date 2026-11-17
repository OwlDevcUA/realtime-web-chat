import { roomsSlice } from "@/features/room/rooms";
import { userSlice } from "@/features/user/user";
import { Action, combineSlices, configureStore, ThunkAction } from "@reduxjs/toolkit";

const rootReducer = combineSlices(
  userSlice,
  roomsSlice,
)

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;