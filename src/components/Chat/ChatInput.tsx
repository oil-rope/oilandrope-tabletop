import React, { FormEvent, useContext, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { WS_TYPES } from '@Constants';
import { IWSClientChatMessage } from './interfaces';

import { AuthContext, CampaignContext } from '@Contexts';
import { ChatContext } from './context';

export const ChatInput = () => {
  const { bot } = useContext(AuthContext);
  const campaign = useContext(CampaignContext);
  const { chatWebSocket } = useContext(ChatContext);

  const [message, setMessage] = useState('');

  /**
   * Checks if received message is a command to roll dice.
   *
   * @param {string} message The message received.
   * @returns {boolean} True if the message is a command for rolling dice, false otherwise
   */
  const isDiceRoll = (message: string): boolean => {
    return message.startsWith(`${bot.command_prefix}roll`);
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!message) return;
    if (!campaign) return;
    chatWebSocket.send(
      JSON.stringify({
        type: WS_TYPES.SEND_MESSAGE,
        message,
        chat: campaign.chat,
      } as IWSClientChatMessage),
    );
    if (isDiceRoll(message)) {
      chatWebSocket.send(
        JSON.stringify({
          type: WS_TYPES.MAKE_ROLL,
          message,
          chat: campaign.chat,
        } as IWSClientChatMessage),
      );
    }
    // Reset form
    setMessage('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="row justify-content-around">
        <Col>
          <Form.Control
            type="text"
            placeholder="Start typing..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Col>
        <Col xs={3} md={4} lg={4} xl={3}>
          <Button
            aria-label="send"
            className="w-100"
            variant="primary"
            type="submit"
          >
            <i className="ic ic-send" />
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};
