import faker from '@faker-js/faker';
import WS from 'jest-websocket-mock';

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SessionContext } from '@Contexts';

import { SessionMock } from '../../__mocks__/helper';

import ChatInput from '@Components/Chat/ChatInput';

const WebSocketURL = 'ws://dummy.url/';
const ChatInputMockedProps = {
  chatWebSocket: new WebSocket('ws://not.url'),
};

let server: WS | null = null;
let client: WebSocket = new WebSocket(WebSocketURL);

beforeEach(async () => {
  server = new WS(WebSocketURL);
  // NOTE: Client is not needed now
  client = new WebSocket(WebSocketURL);
  await server.connected;
});

afterEach(() => {
  WS.clean();
});

describe('ChatInput suite', () => {
  it('renders correctly', () => {
    const { container } = render(<ChatInput {...ChatInputMockedProps} />);

    expect(container).toBeInTheDocument();
  });

  it('updates input on typing', () => {
    render(<ChatInput {...ChatInputMockedProps} />);
    const inputElement = screen.getByPlaceholderText('Start typing...');
    const typingText = faker.lorem.words();

    userEvent.type(inputElement, typingText);

    expect(inputElement).toHaveValue(typingText);
  });

  it('cleans input on enter', () => {
    render(<ChatInput {...ChatInputMockedProps} />);
    const inputElement = screen.getByPlaceholderText('Start typing...');

    userEvent.type(inputElement, faker.lorem.words() + '{enter}', {
      skipClick: true,
    });

    expect(inputElement).toHaveValue('');
  });

  it("submit without message doesn't make any call", async () => {
    const mockedProps = Object.assign({}, ChatInputMockedProps);
    mockedProps.chatWebSocket = client;
    render(
      <SessionContext.Provider value={SessionMock}>
        <ChatInput {...mockedProps} />
      </SessionContext.Provider>,
    );
    const submitButton = screen.getByRole('button', { name: /send/i });

    userEvent.click(submitButton);

    expect(server).toHaveReceivedMessages([]);
  });

  it("submit without session doesn't make any call", async () => {
    render(<ChatInput {...ChatInputMockedProps} />);
    const inputElement = screen.getByPlaceholderText('Start typing...');
    const submitButton = screen.getByRole('button', { name: /send/i });

    userEvent.type(inputElement, faker.lorem.words());
    userEvent.click(submitButton);

    expect(server).toHaveReceivedMessages([]);
  });

  it('submit input calls webSocket', async () => {
    const mockedProps = Object.assign({}, ChatInputMockedProps);
    mockedProps.chatWebSocket = client;
    render(
      <SessionContext.Provider value={SessionMock}>
        <ChatInput {...mockedProps} />,
      </SessionContext.Provider>,
    );
    const inputElement = screen.getByPlaceholderText('Start typing...');
    const submitButton = screen.getByRole('button', { name: /send/i });
    const message = faker.lorem.words();
    const expectedJSONToBeSent = JSON.stringify({
      type: 'send_message',
      message: message,
      chat: SessionMock.chat,
    });

    userEvent.type(inputElement, message);
    userEvent.click(submitButton);

    await expect(server).toReceiveMessage(expectedJSONToBeSent);
  });
});
