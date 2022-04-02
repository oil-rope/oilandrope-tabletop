import { loadChat } from '@Utils/apiCalls';

import React, { FC, useState, useContext, useEffect, useRef } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { WS_TYPES } from '@Constants';
import { SessionContext } from '@Contexts';
import { IMessage } from '@Interfaces';

import Message from './Message';

const MessagesContainerProps = {
  chatWebSocket: PropTypes.instanceOf(WebSocket).isRequired,
  height: PropTypes.number.isRequired,
};

type MessagesContainerTypes = InferProps<typeof MessagesContainerProps>;
const MessagesContainer: FC<MessagesContainerTypes> = ({
  chatWebSocket,
  height,
}) => {
  const container = useRef<HTMLDivElement>(null);
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
  }, [chatWebSocket, chatWebSocket.readyState]);

  useEffect(() => {
    if (container.current) {
      const height = container.current.scrollHeight;
      const clientHeight = container.current.clientHeight;
      container.current.scrollTop = height - clientHeight;
    }
  }, [container, messages]);

  return (
    <Row
      style={{ maxHeight: `${height - height / 8}px`, overflowY: 'scroll' }}
      ref={container}
    >
      <Col role="messages-container">
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
      </Col>
    </Row>
  );
};

MessagesContainer.propTypes = MessagesContainerProps;

export default MessagesContainer;
