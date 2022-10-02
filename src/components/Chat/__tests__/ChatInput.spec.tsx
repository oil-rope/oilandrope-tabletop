import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { BotMock, CampaignMock, chatRender, server } from './testUtils';

import { faker } from '@faker-js/faker';

import { IWSClientChatMessage } from '../interfaces';

import { ChatInput } from '..';

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
  test('renders correctly', async () => {
    render(<ChatInput />, { container: divContainer });

    const inputElement = await screen.findByPlaceholderText('Start typing...');
    expect(inputElement).toBeInTheDocument();
  });
});

describe('ChatInput suite with all contexts', () => {
  test('renders correctly', async () => {
    chatRender(<ChatInput />, {
      container: divContainer,
    });

    const textInputEl = await screen.findByPlaceholderText('Start typing...');
    expect(textInputEl).toBeInTheDocument();
  });
});

describe('ChatInput suite with WebSocket', () => {
  let user: UserEvent;

  beforeAll(() => {
    user = userEvent.setup();
  });

  beforeEach(async () => {
    await server.connected;
  });

  test('message is not send with empty message', async () => {
    chatRender(<ChatInput />, {
      container: divContainer,
    });

    const inputElement = await screen.findByPlaceholderText('Start typing...');
    await user.click(inputElement);
    await user.keyboard('[Enter]');

    await expect(server.messages).toHaveLength(0);
  });

  test('message is not send if campaign is not declared', async () => {
    render(<ChatInput />, {
      container: divContainer,
    });

    const inputElement = await screen.findByPlaceholderText('Start typing...');

    const msg = faker.lorem.sentence();
    await user.type(inputElement, msg);
    await user.keyboard('[Enter]');

    await expect(server.messages).toHaveLength(0);
  });

  test('websocket receives message from form input', async () => {
    chatRender(<ChatInput />, {
      container: divContainer,
    });

    const inputElement = await screen.findByPlaceholderText('Start typing...');

    const msg = faker.lorem.sentence();
    await user.type(inputElement, msg);
    await user.keyboard('[Enter]');

    const expectedMsg: IWSClientChatMessage = {
      type: 'send_message',
      message: msg,
      chat: CampaignMock.chat,
    };
    await expect(server).toReceiveMessage(JSON.stringify(expectedMsg));
  });

  test('websocket receives roll message from form input', async () => {
    chatRender(<ChatInput />, {
      container: divContainer,
    });

    const inputElement = await screen.findByPlaceholderText('Start typing...');

    const msg = `${BotMock.command_prefix}roll 1d20+4-1`;
    await user.type(inputElement, msg);
    await user.keyboard('[Enter]');

    const expectedMsg: IWSClientChatMessage = {
      type: 'send_message',
      message: msg,
      chat: CampaignMock.chat,
    };
    await expect(server).toReceiveMessage(JSON.stringify(expectedMsg));
  });
});
