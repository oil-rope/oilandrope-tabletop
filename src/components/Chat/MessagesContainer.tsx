import React, { FC, useEffect, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import { CHAT_SEND_MESSAGE } from '@Constants';
import { IMessage } from '@/interfaces';

import Message from './Message';

interface MessageWebSocket {
  type: typeof CHAT_SEND_MESSAGE;
  status: string;
  content: IMessage;
}

const MessagesContainerProps = {
  chatWebSocket: PropTypes.instanceOf(WebSocket).isRequired,
};

type MessagesContainerTypes = InferProps<typeof MessagesContainerProps>;
const MessagesContainer: FC<MessagesContainerTypes> = ({ chatWebSocket }) => {
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  useEffect(() => {
    if (chatWebSocket === null) return;
    if (chatWebSocket.onmessage) return;

    chatWebSocket.onmessage = (ev: MessageEvent) => {
      const data: MessageWebSocket = JSON.parse(ev.data);
      if (data.type !== CHAT_SEND_MESSAGE) return;
      const message = Object.assign({}, data.content);
      setMessages((messages) => [...messages, message]);
    };
  }, [chatWebSocket, messages]);

  return (
    <>
      {messages.map((message, index) => (
        <Message
          key={index}
          message={{
            id: message.id,
            chat: message.chat,
            entry_created_at: message.entry_created_at,
            entry_updated_at: message.entry_updated_at,
            message: message.message,
            author: {
              id: message.author.id,
              username: message.author.username,
            },
          }}
        />
      ))}
    </>
  );
};

MessagesContainer.propTypes = MessagesContainerProps;

export default MessagesContainer;
