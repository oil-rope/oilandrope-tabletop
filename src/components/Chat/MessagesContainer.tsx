import { loadChat } from '@Utils/apiCalls';

import React, { FC, useState, useContext, useEffect } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import { WS_TYPES } from '@Constants';
import { SessionContext } from '@Contexts';
import { IMessage } from '@Interfaces';

import Message from './Message';

const MessagesContainerProps = {
  chatWebSocket: PropTypes.instanceOf(WebSocket).isRequired,
};

type MessagesContainerTypes = InferProps<typeof MessagesContainerProps>;
const MessagesContainer: FC<MessagesContainerTypes> = ({ chatWebSocket }) => {
  const session = useContext(SessionContext);
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      const chatJSON = await loadChat(session.chat);
      setMessages(chatJSON.chat_message_set);
    };
    fetchData().catch(alert);
  }, [session]);

  useEffect(() => {
    if (chatWebSocket.readyState !== WebSocket.OPEN) return;
    chatWebSocket.onmessage = (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);
      if (data.type !== WS_TYPES.SEND_MESSAGE) return;
      const message = Object.assign({}, data.content);
      setMessages((messages) => [...messages, message]);
    };
  }, [chatWebSocket]);

  return (
    <div role="mesagges-container">
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
    </div>
  );
};

MessagesContainer.propTypes = MessagesContainerProps;

export default MessagesContainer;
