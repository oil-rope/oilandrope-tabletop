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
  const endOfMessages = useRef<HTMLDivElement>(null);
  const { bot } = useContext(AuthContext);
  const campaign = useContext(CampaignContext);
  const { chatWebSocket } = useContext(ChatContext);

  const [messages, setMessages] = useState<Array<IChatMessage>>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  /**
   * Simple method to scroll to the bottom messages.
   *
   * @param {ScrollBehavior} behavior Type of scroll to perform.
   */
  // eslint-disable-next-line no-undef
  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    endOfMessages.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!campaign) return;
    loadChatMessages(campaign.chat)
      .then((paginatedMessages) => {
        // NOTE: We store it in reverse since they come as last sent first but we render them in order
        // [1: Message 1 (20:00), 2: Message 2 (19:58), 3: Message 3 (19:50)...]
        setMessages(paginatedMessages.results.reverse());
      })
      .then(() => {
        // Once fetch is done we can show messages
        setLoadingMessages(false);
      })
      .catch((err: Error) => {
        alert(err.message);
        setLoadingMessages(false);
      })
      .finally(() => {
        scrollToBottom('auto');
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
    if (loadingMessages) return;
    scrollToBottom('auto');
  }, [messages, loadingMessages]);

  /**
   * Perform action when message is sent.
   *
   * @param {IChatMessage} data Message received from WebSocket.
   */
  const sendMessageAction = (data: IChatMessage) => {
    const message = Object.assign(data);
    // NOTE: We add the message at the bottom since it will be loaded in reverse
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

  if (loadingMessages) {
    return <Loader text="Loading messages..." />;
  }

  return (
    <Row style={{ maxHeight: `${height - height / 8}px`, overflowY: 'scroll' }}>
      <Col role="messages-container">
        {/* NOTE: In order for this to work we need to make a copy of the array */}
        {messages.map((message, index, _list) => (
          <Message key={index} message={message} />
        ))}
        <div ref={endOfMessages} />
      </Col>
    </Row>
  );
};

MessagesContainer.propTypes = MessagesContainerProps;
