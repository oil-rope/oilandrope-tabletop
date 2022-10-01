import React, { useContext, useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { CHAT_WEBSOCKET, WS_TYPES } from '@Constants';
import { AuthContext, CampaignContext } from '@Contexts';

import Loader from '@Components/Loader';

import { ChatInput, MessagesContainer } from '.';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const campaign = useContext(CampaignContext);
  const [chatWS, setChatWS] = useState<WebSocket | null>(null);
  const reconnectMessage = "You've been disconnected. Reconnect?";
  const canvasContainer = document.getElementById('tabletopCanvasContainer');
  let height = 720;
  if (canvasContainer) {
    height = canvasContainer.offsetHeight;
  }

  useEffect(() => {
    if (!chatWS) return;
    if (!chatWS.onclose) {
      chatWS.onclose = (ev: CloseEvent) => {
        if (ev.wasClean) return;
        const reconnect = confirm(reconnectMessage);
        if (reconnect) setChatWS(new WebSocket(`${CHAT_WEBSOCKET}`));
      };
    }
  }, [chatWS]);

  useEffect(() => {
    // Do nothing until user is loaded
    if (user === null) return;
    if (campaign === null) return;
    // For some reason if we declare the WebSocket object on top it would connect at least 5 times
    if (chatWS === null) {
      setChatWS(new WebSocket(`${CHAT_WEBSOCKET}`));
      return;
    }

    chatWS.onopen = () => {
      chatWS.send(
        JSON.stringify({
          type: WS_TYPES.SETUP_CHANNEL,
          token: user.token,
          chat: campaign.chat,
        }),
      );
    };
  }, [user, chatWS, campaign]);

  if (chatWS === null) {
    return (
      <Container
        fluid={true}
        className="bg-light pb-4 h-100"
        style={{
          maxHeight: `${height}px`,
        }}
      >
        <Loader text="Connecting chat..." />
      </Container>
    );
  }

  return (
    <Container
      fluid={true}
      className="bg-light pb-4 h-100"
      style={{
        maxHeight: `${height}px`,
      }}
    >
      <MessagesContainer chatWebSocket={chatWS} height={height} />
      <Row className="pt-3">
        <Col>
          <ChatInput chatWebSocket={chatWS} />
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
