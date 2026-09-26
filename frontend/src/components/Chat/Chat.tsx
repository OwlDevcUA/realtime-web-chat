'use client';

import { useState } from "react"
import { RoomList } from "../Rooms/RoomList";
import { MessageList } from "../MessageList";
import { MessageForm } from "../MessageForm";
import { RoomCreateForm } from "../Rooms/RoomCreateForm";
import { DataLoader } from "@/DataLoader";
import { UsernameForm } from "../UserNameForm/UserForm";
import './Chat.scss';
import { useParams } from "next/navigation";
import { useMessages } from "@/hooks/useMessages";
import { useRooms } from "@/hooks/useRooms";
import { useUser } from "@/hooks/useUser";


export const Chat = () => {
  const params = useParams();
  const roomId = params?.roomId as string | undefined;

  const [roomCreateIsOpen, setRoomCreateIsOpen] = useState(false)

  const { messages, setMessages, saveData } = useMessages(roomId);
  const { rooms, addRoom, deleteRoom, onUpdate, } = useRooms();
  const { user, isLoading } = useUser();

if (isLoading) {
  return <div>Загрузка...</div>;
}

  return (
    <div className="chat">
      <DataLoader onData={saveData} roomId={roomId} />
      {!user ? (
        <div className="modal-overlay">
          <UsernameForm />
        </div>
      ) : (
        <>
      {roomCreateIsOpen && (
        <RoomCreateForm
          userId={user.id}
          onSet={addRoom}
          onClose={setRoomCreateIsOpen}
        />
      )}

      <RoomList
        rooms={rooms}
        userId={user.id}
        onOpen={setRoomCreateIsOpen}
        onDelete={deleteRoom}
        onUpdate={onUpdate}
      />

      <div className="chat__main">
        <MessageList messages={messages} username={user.username} />
        <MessageForm
          username={user.username}
          roomId={roomId}
          userId={user.id}
          setMessages={setMessages}
        />
      </div>
    </>
      )}
    </div>
  )
}
