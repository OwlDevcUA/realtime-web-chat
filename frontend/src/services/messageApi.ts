import { api } from "./api";

export async function getMessages() {
  const response = await api.get('/chat')
  return response.data;
}

export async function getRoomMessages(roomId: string) {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data;
}

export async function postMessage(text: string) {
  const response = await api.post('/chat', { text })
  return response.data;
}

export async function postRoomMessage(
   text: string,
   roomId: string,
) {
  const response = await api.post(`/rooms/${roomId}`, { text })
  return response.data;
}
