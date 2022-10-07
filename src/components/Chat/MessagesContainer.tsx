import { loadChatMessages } from '@Utils/apiCalls';

import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Loader from '@Components/Loader';

import { WS_TYPES } from '@Constants';
import { IChatMessage } from '@Interfaces';
import { IRoll, IWSServerChatMessage } from './interfaces';

import { AuthContext, CampaignContext } from '@Contexts';
import { ChatContext } from './context';

import { Message } from '.';

const MessagesContainerProps = {
  height: PropTypes.number.isRequired,
};

type MessagesContainerTypes = InferProps<typeof MessagesContainerProps>;
export const MessagesContainer: FC<MessagesContainerTypes> = ({ height }) => {
  const container = useRef<HTMLDivElement>(null);
  const { bot } = useContext(AuthContext);
  const campaign = useContext(CampaignContext);
  const { chatWebSocket } = useContext(ChatContext);

  const [messages, setMessages] = useState<Array<IChatMessage>>([]);
  const [loadingMessage, setLoadingMessages] = useState(true);

  useEffect(() => {
    if (!campaign) return;
    loadChatMessages(campaign.chat)
      .then((paginatedMessages) => {
        setMessages(paginatedMessages.results);
      })
      .then(() => {
        // Once fetch is done we can show messages
        setLoadingMessages(false);
      })
      .catch((err: Error) => {
        alert(err.message);
        setLoadingMessages(false);
      });
  }, [campaign]);

  useEffect(() => {
    if (!bot) return;
    if (!chatWebSocket.onmessage) {
      chatWebSocket.onmessage = (ev: MessageEvent) => {
        const data: IWSServerChatMessage = JSON.parse(ev.data);
        if (data.type === WS_TYPES.RECEIVE_MESSAGE) {
          if (data.content.author.id === bot.id) {
            return makeRollAction(data.content, data.roll || {});
          }
          return sendMessageAction(data.content);
        }
      };
    }
  }, [chatWebSocket, bot]);

  useEffect(() => {
    if (container.current) {
      const height = container.current.scrollHeight;
      const clientHeight = container.current.clientHeight;
      container.current.scrollTop = height - clientHeight;
    }
  }, [container]);

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

  if (loadingMessage) {
    return <Loader text="Loading messages..." />;
  }

  return (
    <Row
      style={{ maxHeight: `${height - height / 8}px`, overflowY: 'scroll' }}
      ref={container}
    >
      <Col role="messages-container">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </Col>
    </Row>
  );
};

MessagesContainer.propTypes = MessagesContainerProps;
