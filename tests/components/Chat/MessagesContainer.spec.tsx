import faker from '@faker-js/faker';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import WS from 'jest-websocket-mock';

import React from 'react';
import { render, screen, act } from '@testing-library/react';

import { WS_TYPES } from '@Constants';

import { AuthContext, SessionContext } from '@Contexts';

import MessagesContainer from '@Components/Chat/MessagesContainer';

import {
  ChatMock,
  MessageMock,
  SessionMock,
  UserMock,
} from '../../__mocks__/helper';

const dummyURL = `ws://${faker.internet.domainName()}`;
const MessagesContainerMockedProps = {
  chatWebSocket: new WebSocket('ws://no.url'),
};

beforeAll(() => {
  enableFetchMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
  WS.clean();
});

// NOTE: User has to be logged in order for messages to be shown
describe('MessagesContainer suite', () => {
  it('renders correctly', () => {
    const { container } = render(
      <MessagesContainer {...MessagesContainerMockedProps} />,
    );

    expect(container).toBeInTheDocument();
  });

  it('renders messages', async () => {
    const chatMock = Object.assign({}, ChatMock);
    chatMock.chat_message_set = [MessageMock];
    fetchMock.mockResponseOnce(JSON.stringify(chatMock));
    render(
      <AuthContext.Provider value={UserMock}>
        <SessionContext.Provider value={SessionMock}>
          <MessagesContainer {...MessagesContainerMockedProps} />
        </SessionContext.Provider>
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(MessageMock.message)).toBeInTheDocument();
  });

  it('renders multiple messages', async () => {
    const messageMock = Object.assign({}, MessageMock);
    messageMock.message = faker.lorem.words();
    const chatMock = Object.assign({}, ChatMock);
    chatMock.chat_message_set = [MessageMock, messageMock];
    fetchMock.mockResponseOnce(JSON.stringify(chatMock));
    const { getAllByText } = render(
      <AuthContext.Provider value={UserMock}>
        <SessionContext.Provider value={SessionMock}>
          <MessagesContainer {...MessagesContainerMockedProps} />
        </SessionContext.Provider>
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(MessageMock.message)).toBeInTheDocument();
    expect(getAllByText(MessageMock.author.username).length).toEqual(2);
  });

  it('adds new message on WebSocket send', async () => {
    const server = new WS(dummyURL);
    const client = new WebSocket(dummyURL);
    await server.connected;
    fetchMock.mockResponseOnce(JSON.stringify(ChatMock));

    const mockedProps = Object.assign({}, MessagesContainerMockedProps);
    mockedProps.chatWebSocket = client;
    // NOTE: This wrapper doesn't actually do nothing. It just avoid `act` wrapper warning
    await act(async () => {
      render(
        <AuthContext.Provider value={UserMock}>
          <SessionContext.Provider value={SessionMock}>
            <MessagesContainer {...mockedProps} />
          </SessionContext.Provider>
        </AuthContext.Provider>,
      );
    });

    const messageToSend = JSON.stringify({
      type: WS_TYPES.SEND_MESSAGE,
      content: MessageMock,
      status: 'ok',
    });
    server.send(messageToSend);

    expect(screen.getByText(MessageMock.message)).toBeInTheDocument();
  });

  it("doesn't add new message if type is incorrect", async () => {
    const server = new WS(dummyURL);
    const client = new WebSocket(dummyURL);
    await server.connected;
    fetchMock.mockResponseOnce(JSON.stringify(ChatMock));

    const mockedProps = Object.assign({}, MessagesContainerMockedProps);
    mockedProps.chatWebSocket = client;
    // NOTE: This wrapper doesn't actually do nothing. It just avoid `act` wrapper warning
    await act(async () => {
      render(
        <AuthContext.Provider value={UserMock}>
          <SessionContext.Provider value={SessionMock}>
            <MessagesContainer {...mockedProps} />
          </SessionContext.Provider>
        </AuthContext.Provider>,
      );
    });

    const messageToSend = JSON.stringify({
      type: faker.lorem.word(),
      content: MessageMock,
      status: 'ok',
    });
    server.send(messageToSend);

    expect(document.body).not.toContain(MessageMock.message);
  });
});
