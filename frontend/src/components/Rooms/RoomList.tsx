'use client';

import { RoomItem } from "./RoomItem"
import './Rooms.scss';
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import { loadRooms } from "@/features/room/rooms";
import Image from 'next/image';
import settingIcon from "../../assets/icons/setting.png";

type Props = {
  onOpen: (isOpen: boolean) => void;
}

export const RoomList: React.FC<Props> = ({ onOpen }) => {
  const { rooms } = useAppSelector(state => state.rooms);
  
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadRooms())
  }, [dispatch])

  return (
    <ul className="roomList">
      <div className="roomList__banner">
        <Link href={`/`} className="roomList__bannerGlobalBtn">Chat</Link>
      <Link href={`/settings`} className="roomList__bannerSettingsBtn">
        <Image className="roomList__settingImg" src={settingIcon} alt="" />
      </Link>
      </div>
      <button className="roomList__createBtn" onClick={() => onOpen(true)}>Create</button>
      <li className="room">
          <Link
            href={`/`}>
          <h2 className="room__name">General</h2>
          </Link>
      </li>
      {rooms.map(room => (
        <li key={room.id} className="roomList__item">
          <RoomItem
          room={room}
          />
        </li>
      ))}
    </ul>
  )
}
