import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { CHAT_WEBSOCKET } from '@Constants';
import { AuthContext } from '@/contexts';

import Loader from '@Components/Loader';

import Message from './Message';
import ChatInput from './ChatInput';

const Chat = () => {
  const user = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [chatWS, setChatWS] = useState<WebSocket | null>(null);

  const handleChatWSOnOpen = () => {
    setLoading(false);
    chatWS?.send(
      JSON.stringify({
        type: 'setup_channel_layer',
        token: user?.token,
        chat: 1,
      }),
    );
  };

  useEffect(() => {
    if (user === null) return;
    if (chatWS === null) {
      setChatWS(new WebSocket(CHAT_WEBSOCKET));
      return;
    }
    // NOTE: Since `React.useState` works with fallbacks `OpenState` is not immediately launched.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chatWS!.onopen = handleChatWSOnOpen;
  }, [user, chatWS]);

  if (loading) {
    return <Loader text="Loading chat..." />;
  } else {
    return (
      <Container fluid className="bg-light pb-4">
        <Row>
          <Col>
            <Message
              message={{
                id: 1,
                chat: 1,
                entry_created_at: '2021-01-01T10:30:00Z',
                entry_updated_at: '2021-01-01',
                message: 'Hello~',
                author: {
                  id: 1,
                  username: 'LeCuay',
                },
              }}
            />
            <Message
              message={{
                id: 2,
                chat: 1,
                entry_created_at: '2021-01-01T10:31:00Z',
                entry_updated_at: '2021-01-01T10:31:00Z',
                message: 'Hi!',
                author: {
                  id: 2,
                  username: 'TestUser',
                },
              }}
            />
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
