import { loadChat } from '@Utils/apiCalls';

import React, { FC, useState, useContext, useEffect, useRef } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { WS_TYPES } from '@Constants';
import { IMessage } from '@Interfaces';
import { SessionContext } from '@Contexts';
import { IWebSocketMessage } from './interfaces';
import { ChatContext, ColorMapTypes } from './context';

import { Message } from '.';

const MessagesContainerProps = {
  chatWebSocket: PropTypes.instanceOf(WebSocket).isRequired,
  height: PropTypes.number.isRequired,
};

type MessagesContainerTypes = InferProps<typeof MessagesContainerProps>;
export const MessagesContainer: FC<MessagesContainerTypes> = ({
  chatWebSocket,
  height,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const session = useContext(SessionContext);
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  // NOTE: This is needed to make sure that the messages are always the same color.
  const colorMap = useRef<ColorMapTypes>({});

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
      const data: IWebSocketMessage = JSON.parse(ev.data);
      if (data.type === WS_TYPES.SEND_MESSAGE) sendMessageAction(data.content);
      if (data.type === WS_TYPES.MAKE_ROLL) makeRollAction(data.content);
    };
  }, [chatWebSocket, chatWebSocket.readyState]);

  useEffect(() => {
    if (container.current) {
      const height = container.current.scrollHeight;
      const clientHeight = container.current.clientHeight;
      container.current.scrollTop = height - clientHeight;
    }
  }, [container, messages]);

  /**
   * Perform action when message is sent.
   *
   * @param {IMessage} data Message received from WebSocket.
   */
  const sendMessageAction = (data: IMessage) => {
    const message = Object.assign(data);
    setMessages((messages) => [...messages, message]);
  };

  /**
   * Perform action when message is sent and it's a roll.
   *
   * @param {IMessage} data Message received from WebSocket.
   */
  const makeRollAction = (data: IMessage) => {
    const message = Object.assign(data);
    setMessages((messages) => [...messages, message]);
  };

  return (
    <Row
      style={{ maxHeight: `${height - height / 8}px`, overflowY: 'scroll' }}
      ref={container}
    >
      <Col role="messages-container">
        <ChatContext.Provider value={{ colorMap: colorMap.current }}>
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
        </ChatContext.Provider>
      </Col>
    </Row>
  );
};

MessagesContainer.propTypes = MessagesContainerProps;
