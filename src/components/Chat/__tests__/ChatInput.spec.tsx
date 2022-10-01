import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import {
  tabletopRender,
  CampaignMock,
  BotMock,
} from '@Components/__tests__/testUtils';

import { faker } from '@faker-js/faker';
import WS from 'jest-websocket-mock';

import { IWSSendChatMessage } from '../interfaces';

import { ChatInput } from '..';

const DummyWS = new WebSocket('ws://dummy.url.com');
let divContainer: HTMLDivElement;

beforeEach(() => {
  divContainer = document.createElement('div');
  document.body.appendChild(divContainer);
});

afterEach(() => {
  unmountComponentAtNode(divContainer);
  divContainer.remove();
  divContainer = null;
});

describe('ChatInput suite without context', () => {
  test('renders correctly', () => {
    render(<ChatInput chatWebSocket={DummyWS} />, { container: divContainer });
  });
});

describe('ChatInput suite with all contexts', () => {
  test('renders correctly', async () => {
    tabletopRender(<ChatInput chatWebSocket={DummyWS} />, {
      container: divContainer,
    });

    const textInputEl = await screen.findByPlaceholderText('Start typing...');
    expect(textInputEl).toBeInTheDocument();
  });
});

describe('ChatInput suite with WebSocket', () => {
  let chatWebSocket: WebSocket;
  let user: UserEvent;
  const WSDummyURL = 'ws://dummy.url';
  const server = new WS(WSDummyURL);

  beforeAll(() => {
    user = userEvent.setup();
  });

  beforeEach(async () => {
    chatWebSocket = new WebSocket(WSDummyURL);
    await server.connected;
  });

  test('message is not send with empty message', async () => {
    tabletopRender(<ChatInput chatWebSocket={chatWebSocket} />, {
      container: divContainer,
    });

    const inputElement = await screen.findByPlaceholderText('Start typing...');
    await user.click(inputElement);
    await user.keyboard('[Enter]');

    await expect(server.messages).toHaveLength(0);
  });

  test('message is not send if campaign is not declared', async () => {
    render(<ChatInput chatWebSocket={chatWebSocket} />, {
      container: divContainer,
    });

    const inputElement = await screen.findByPlaceholderText('Start typing...');

    const msg = faker.lorem.sentence();
    await user.type(inputElement, msg);
    await user.keyboard('[Enter]');

    await expect(server.messages).toHaveLength(0);
  });

  test('websocket receives message from form input', async () => {
    tabletopRender(<ChatInput chatWebSocket={chatWebSocket} />, {
      container: divContainer,
    });

    const inputElement = await screen.findByPlaceholderText('Start typing...');

    const msg = faker.lorem.sentence();
    await user.type(inputElement, msg);
    await user.keyboard('[Enter]');

    const expectedMsg = JSON.stringify({
      type: 'send_message',
      message: msg,
      chat: CampaignMock.chat,
    } as IWSSendChatMessage);
    await expect(server).toReceiveMessage(expectedMsg);
  });

  test('websocket receives roll message from form input', async () => {
    tabletopRender(<ChatInput chatWebSocket={chatWebSocket} />, {
      container: divContainer,
    });

    const inputElement = await screen.findByPlaceholderText('Start typing...');

    const msg = `${BotMock.command_prefix}roll 1d20+4-1`;
    await user.type(inputElement, msg);
    await user.keyboard('[Enter]');

    const expectedMsg = JSON.stringify({
      type: 'send_message',
      message: msg,
      chat: CampaignMock.chat,
    } as IWSSendChatMessage);
    await expect(server).toReceiveMessage(expectedMsg);
  });
});
