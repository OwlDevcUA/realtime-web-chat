export interface Message {
  time: Date | string,
  id: string,
  text: string,
  roomId: string;
  User?: {
    id: string;
    username: string;
  }
}
