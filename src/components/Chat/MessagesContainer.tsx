import { loadChatMessages } from '@Utils/apiCalls';

import React, { FC, useState, useContext, useEffect, useRef } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { WS_TYPES } from '@Constants';
import { IChatMessage } from '@Interfaces';
import { AuthContext, CampaignContext } from '@Contexts';
import { IWebSocketMessage, IRoll } from './interfaces';
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
  const { bot } = useContext(AuthContext);
  const campaign = useContext(CampaignContext);
  const [messages, setMessages] = useState<Array<IChatMessage>>([]);
  // NOTE: This is needed to make sure that the messages are always the same color.
  const colorMap = useRef<ColorMapTypes>({});

  useEffect(() => {
    if (!campaign) return;
    loadChatMessages(campaign.chat)
      .then((paginatedMessages) => {
        setMessages(paginatedMessages.results);
      })
      .catch(() => alert("Could't load messages"));
  }, [campaign]);

  useEffect(() => {
    if (!bot) return;
    if (chatWebSocket.readyState !== WebSocket.OPEN) return;
    chatWebSocket.onmessage = (ev: MessageEvent) => {
      const data: IWebSocketMessage = JSON.parse(ev.data);
      if (data.type === WS_TYPES.SEND_MESSAGE) {
        if (data.content.author.id === bot.id) {
          return makeRollAction(data.content, data.roll || {});
        }
        return sendMessageAction(data.content);
      }
    };
  }, [chatWebSocket, chatWebSocket.readyState, bot]);

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
   * @param {IChatMessage} data Message received from WebSocket.
   */
  const sendMessageAction = (data: IChatMessage) => {
    const message = Object.assign(data);
    setMessages((messages) => [...messages, message]);
  };

  /**
   * Perform action when message is sent and it's a roll.
   *
   * @param {IChatMessage} data Message received from WebSocket.
   * @param {IRoll} roll Roll data.
   */
  const makeRollAction = (data: IChatMessage, roll: IRoll) => {
    const message = Object.assign(data);
    message.roll = roll;
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
            <Message key={index} message={message} />
          ))}
        </ChatContext.Provider>
      </Col>
    </Row>
  );
};

MessagesContainer.propTypes = MessagesContainerProps;
