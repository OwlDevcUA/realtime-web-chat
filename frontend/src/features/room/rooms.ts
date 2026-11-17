import { checkUser, createRoom, deleteRoom, getRooms, renameRoom } from "@/services/roomApi";
import { Room } from "@/types/Room";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomState {
  rooms: Room[];
  loaded: boolean;
  hasError: boolean;
  joinedRoomIds: string[];
}

const initialState: RoomState = {
  rooms: [],
  loaded: false,
  hasError: false,
  joinedRoomIds: [],
}

export const loadRooms = createAsyncThunk(
  'rooms/loadRooms',
  async () => {
    return getRooms();
  }
)

export const removeRoom = createAsyncThunk(
  'room/delete',
  async (roomId: string) => {
    await deleteRoom(roomId)
    return roomId
  }
)

export const changeRoomName = createAsyncThunk(
  'room/rename',
  async ({ newName, roomId }: { newName: string, roomId: string }) => {
    return renameRoom(newName, roomId)
  }
)

export const addRoom = createAsyncThunk(
  'room/create',
  async ({name}: {name: string}) => {
    return createRoom(name)
  }
)

export const checkUserInRoom = createAsyncThunk(
  'room/checkUser',
  async ({ userId, roomId }: { userId: string, roomId: string }) => {
    const isInRoom = await checkUser(userId, roomId)
    return {roomId, isInRoom};
  }
)

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setJoinedStatus(state, action: PayloadAction<{ roomId: string; isInRoom: boolean }>) {
      const { roomId, isInRoom } = action.payload;
      if (isInRoom) {
        if (!state.joinedRoomIds.includes(roomId)) {
          state.joinedRoomIds.push(roomId);
        }
      } else {
        state.joinedRoomIds = state.joinedRoomIds.filter((id) => id !== roomId);
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(loadRooms.pending, state => {
      state.loaded = false;
      state.hasError = false;
    });
    builder.addCase(loadRooms.fulfilled, (state, action) => {
      state.rooms = action.payload;
      state.loaded = true;
    });
    builder.addCase(loadRooms.rejected, state => {
      state.loaded = true;
      state.hasError = true;
    });
    builder.addCase(removeRoom.fulfilled, (state, action) => {
      state.rooms = state.rooms.filter(
        room => room.id !== action.payload,
      )
    });
    builder.addCase(removeRoom.rejected, state => {
      state.hasError = true;
    });
    builder.addCase(changeRoomName.fulfilled, (state, action) => {
      const room = state.rooms.find((r) => r.id === action.payload.id);
  
      if (room) {
        room.name = action.payload.name;
      }
    });
    builder.addCase(changeRoomName.rejected, state => {
      state.hasError = true;
    });
    builder.addCase(addRoom.fulfilled, (state, action) => {
      state.rooms.push(action.payload);
      state.loaded = true;
    });
    builder.addCase(addRoom.rejected, state => {
      state.loaded = true;
      state.hasError = true;
    });
    builder.addCase(checkUserInRoom.fulfilled, (state, action) => {
      const { roomId, isInRoom } = action.payload;
      if (isInRoom) {
        if (!state.joinedRoomIds.includes(roomId)) {
          state.joinedRoomIds.push(roomId);
        }
      } else {
        state.joinedRoomIds = state.joinedRoomIds.filter((id) => id !== roomId);
      }
    });
  }
})