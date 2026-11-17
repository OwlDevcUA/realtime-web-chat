'use client';

import type React from "react";
import type { Message } from "@/types/Message";
import classNames from "classnames";
import './MessageList.scss';
import { useAppSelector } from "@/hooks/hooks";

type Props = {
  messages: Message[];
}

export const MessageList: React.FC<Props> = ({ messages }) => {
  const { user } = useAppSelector((state) => state.user);
  
  return (
    <div className="messageList">
      <ul className="messageList__list">
        {messages.map(message => (
          <li className={classNames('messageList__message', {
            'messageList__messageLeft': message.User?.id !== user?.id
          })} key={message.id}>
            <h2 className="messageList__username">{message.User?.username}</h2>
            <p className="messageList__text">{message.text}</p>
            <p className="messageList__time">{message.time.toString()}</p>
          </li>
        ))}
      </ul>
   </div>
  )
}
