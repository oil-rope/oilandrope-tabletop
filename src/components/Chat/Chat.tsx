import React, { useContext, useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { CHAT_WEBSOCKET } from '@Constants';
import { AuthContext } from '@/contexts';

import Loader from '@Components/Loader';

import ChatInput from './ChatInput';
import MessagesContainer from './MessagesContainer';

const Chat = () => {
  const user = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [chatWS, setChatWS] = useState<WebSocket>(new WebSocket('ws://dummy/'));
  const reconnectMessage =
    "Seems like you've been disconnected from chat. Would you like to reconnect?";

  useEffect(() => {
    // Do nothing until user is loaded
    if (user === null) return;
    // For some reason if we declare the WebSocket object on top it would connect at least 5 times
    if (chatWS.url === 'ws://dummy/') {
      setChatWS(new WebSocket(CHAT_WEBSOCKET));
      return;
    }

    chatWS.onopen = () => {
      chatWS.send(
        JSON.stringify({
          type: 'setup_channel_layer',
          token: user?.token,
          chat: 1,
        }),
      );
      setLoading(false);
    };

    chatWS.onclose = (ev: CloseEvent) => {
      if (ev.wasClean) return;
      const reconnect = confirm(reconnectMessage);
      if (!reconnect) return;
      setChatWS(new WebSocket(CHAT_WEBSOCKET));
    };
  }, [user, chatWS]);

  if (loading) {
    return <Loader text="Loading chat..." />;
  } else {
    return (
      <Container fluid className="bg-light pb-4">
        <Row>
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
