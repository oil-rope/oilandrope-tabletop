import React, { FC, FormEvent, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { CHAT_SEND_MESSAGE } from '@Constants';

const ChatInputProps = {
  chatWebSocket: PropTypes.instanceOf(WebSocket).isRequired,
};

type ChatInputTypes = InferProps<typeof ChatInputProps>;
const ChatInput: FC<ChatInputTypes> = ({ chatWebSocket }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!message) return;
    chatWebSocket.send(
      JSON.stringify({
        type: CHAT_SEND_MESSAGE,
        message,
        chat: 1,
      }),
    );
    ev.currentTarget.dispatchEvent(new Event('reset'));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="row justify-content-around">
        <Col>
          <Form.Control
            type="text"
            placeholder="Start typing..."
            onChange={(e) => setMessage(e.target.value)}
          />
        </Col>
        <Col xs={3} md={4} xl={3}>
          <Button className="w-100" variant="primary" type="submit">
            <i className="ic ic-send" />
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

ChatInput.propTypes = ChatInputProps;

export default ChatInput;
