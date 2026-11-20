'use client';

import { useState } from "react"
import { RoomList } from "../Rooms/RoomList";
import { MessageList } from "../MessageList";
import { MessageForm } from "../MessageForm";
import { RoomCreateForm } from "../Rooms/RoomCreateForm";

import './Chat.scss';
import { useParams } from "next/navigation";
import { useMessages } from "@/hooks/useMessages";
import { useAppSelector } from "@/hooks/hooks";
import { DataLoader } from "../DataLoader/DataLoader";



export const Chat = () => {
  const { user } = useAppSelector((state) => state.user);
  
  const params = useParams();
  const roomId = params?.roomId as string | undefined;

  const [roomCreateIsOpen, setRoomCreateIsOpen] = useState(false)

  const { messages, saveData } = useMessages(roomId, user !== null);

  return (
    <div className="chat">
      <DataLoader onData={saveData} roomId={roomId} />
      {roomCreateIsOpen && (
        <RoomCreateForm
          onClose={setRoomCreateIsOpen}
        />
      )}

      <RoomList
        onOpen={setRoomCreateIsOpen}
      />

      <div className="chat__main">
        <MessageList messages={messages} />
        <MessageForm
          roomId={roomId}
          onSet={saveData}
        />
      </div>
    </div>
  )
}
