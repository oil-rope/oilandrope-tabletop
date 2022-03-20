import React, { FC, Fragment, useContext, useEffect, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import { WS_TYPES } from '@Constants';
import { IMessage } from '@/interfaces';

import Message from './Message';
import { SessionContext } from '@/contexts';

interface MessageWebSocket {
  type: typeof WS_TYPES.SEND_MESSAGE;
  status: string;
  content: IMessage;
}

const MessagesContainerProps = {
  chatWebSocket: PropTypes.instanceOf(WebSocket).isRequired,
};

type MessagesContainerTypes = InferProps<typeof MessagesContainerProps>;
const MessagesContainer: FC<MessagesContainerTypes> = ({ chatWebSocket }) => {
  const session = useContext(SessionContext);
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  useEffect(() => {
    if (chatWebSocket === null) return;
    if (chatWebSocket.onmessage) return;

    chatWebSocket.onmessage = (ev: MessageEvent) => {
      const data: MessageWebSocket = JSON.parse(ev.data);
      if (data.type !== WS_TYPES.SEND_MESSAGE) return;
      const message = Object.assign({}, data.content);
      setMessages((messages) => [...messages, message]);
    };
  }, [chatWebSocket, messages]);

  useEffect(() => {
    if (session === null) return;
    setMessages(session.chat.chat_message_set);
  }, [session]);

  return (
    <Fragment>
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
    </Fragment>
  );
};

MessagesContainer.propTypes = MessagesContainerProps;

export default MessagesContainer;
