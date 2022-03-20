import React, { useContext, useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { CHAT_WEBSOCKET, WS_TYPES } from '@Constants';
import { AuthContext, SessionContext } from '@/contexts';

import Loader from '@Components/Loader';

import ChatInput from './ChatInput';
import MessagesContainer from './MessagesContainer';

const Chat = () => {
  const user = useContext(AuthContext);
  const session = useContext(SessionContext);
  const [chatWS, setChatWS] = useState<WebSocket | null>(null);
  const reconnectMessage =
    "Seems like you've been disconnected from chat. Would you like to reconnect?";
  const canvasContainer = document.getElementById('tabletopCanvasContainer');
  const height = canvasContainer?.offsetHeight || 720;

  useEffect(() => {
    // Do nothing until user is loaded
    if (user === null) return;
    if (session === null) return;
    // For some reason if we declare the WebSocket object on top it would connect at least 5 times
    if (chatWS === null) {
      setChatWS(new WebSocket(CHAT_WEBSOCKET));
      return;
    }

    chatWS.onopen = () => {
      chatWS.send(
        JSON.stringify({
          type: WS_TYPES.SETUP_CHANNEL,
          token: user.token,
          chat: session.chat.id,
        }),
      );
    };

    chatWS.onclose = (ev: CloseEvent) => {
      if (ev.wasClean) return;
      const reconnect = confirm(reconnectMessage);
      if (!reconnect) return;
      setChatWS(new WebSocket(CHAT_WEBSOCKET));
    };
  }, [user, chatWS, session]);

  if (chatWS === null) {
    return <Loader text="Loading chat..." />;
  } else {
    return (
      <Container
        fluid={true}
        className="bg-light pb-4 h-100"
        style={{
          maxHeight: `${height}px`,
        }}
      >
        <Row
          style={{ maxHeight: `${height - height / 8}px`, overflowY: 'scroll' }}
        >
          <Col>
            <MessagesContainer chatWebSocket={chatWS} />
          </Col>
        </Row>
        <Row className="pt-3">
          <Col>
            <ChatInput chatWebSocket={chatWS} />
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Chat;
