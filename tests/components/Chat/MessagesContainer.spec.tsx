import faker from '@faker-js/faker';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import WS from 'jest-websocket-mock';

import React from 'react';
import { render, screen } from '@testing-library/react';

import { WS_TYPES } from '@Constants';

import { AuthContext, CampaignContext } from '@Contexts';

import { MessagesContainer } from '@Components/Chat';

import {
  BotMock,
  ChatMock,
  MessageMock,
  messageWithRollFactory,
  SessionMock,
  UserMock,
} from '../../__mocks__/helper';

const dummyURL = `ws://${faker.internet.domainName()}`;
const MessagesContainerMockedProps = {
  chatWebSocket: new WebSocket('ws://no.url'),
  height: 720,
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
    chatMock.chat_message_set = [MessageMock.id];
    fetchMock.mockResponseOnce(JSON.stringify(chatMock));
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <CampaignContext.Provider value={SessionMock}>
          <MessagesContainer {...MessagesContainerMockedProps} />
        </CampaignContext.Provider>
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(MessageMock.message)).toBeInTheDocument();
  });

  it('renders multiple messages', async () => {
    const messageMock = Object.assign({}, MessageMock);
    messageMock.message = faker.lorem.words();
    const chatMock = Object.assign({}, ChatMock);
    chatMock.chat_message_set = [MessageMock.id, messageMock.id];
    fetchMock.mockResponseOnce(JSON.stringify(chatMock));
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <CampaignContext.Provider value={SessionMock}>
          <MessagesContainer {...MessagesContainerMockedProps} />
        </CampaignContext.Provider>
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(MessageMock.message)).toBeInTheDocument();
    expect(screen.getAllByText(MessageMock.author.username)).toHaveLength(2);
  });

  it('adds new message on WebSocket sent', async () => {
    const server = new WS(dummyURL);
    const client = new WebSocket(dummyURL);
    await server.connected;
    fetchMock.mockResponseOnce(JSON.stringify(ChatMock));

    const mockedProps = Object.assign({}, MessagesContainerMockedProps);
    mockedProps.chatWebSocket = client;
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: BotMock }}>
        <CampaignContext.Provider value={SessionMock}>
          <MessagesContainer {...mockedProps} />
        </CampaignContext.Provider>
      </AuthContext.Provider>,
    );
    // NOTE: This wrapper doesn't actually do nothing. It just avoid `act` wrapper warning
    expect(await screen.findByRole('messages-container'));

    const messageToSend = JSON.stringify({
      type: WS_TYPES.SEND_MESSAGE,
      content: MessageMock,
    });
    server.send(messageToSend);

    expect(screen.getByText(MessageMock.message)).toBeInTheDocument();
  });

  it('adds new message on WebSocket type make_roll sent', async () => {
    const server = new WS(dummyURL);
    const client = new WebSocket(dummyURL);
    await server.connected;
    fetchMock.mockResponseOnce(JSON.stringify(ChatMock));

    const mockedProps = Object.assign({}, MessagesContainerMockedProps);
    mockedProps.chatWebSocket = client;
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: BotMock }}>
        <CampaignContext.Provider value={SessionMock}>
          <MessagesContainer {...mockedProps} />
        </CampaignContext.Provider>
      </AuthContext.Provider>,
    );
    const messageMock = messageWithRollFactory({ id: BotMock.id });
    // NOTE: This wrapper doesn't actually do nothing. It just avoid `act` wrapper warning
    expect(await screen.findByRole('messages-container'));

    const messageToSend = JSON.stringify({
      type: WS_TYPES.SEND_MESSAGE,
      content: messageMock,
    });
    server.send(messageToSend);

    expect(screen.getByText(messageMock.message)).toBeInTheDocument();
  });

  it("doesn't add new message if type is incorrect", async () => {
    const server = new WS(dummyURL);
    const client = new WebSocket(dummyURL);
    await server.connected;
    fetchMock.mockResponseOnce(JSON.stringify(ChatMock));

    const mockedProps = Object.assign({}, MessagesContainerMockedProps);
    mockedProps.chatWebSocket = client;
    render(
      <AuthContext.Provider value={{ user: UserMock, bot: null }}>
        <CampaignContext.Provider value={SessionMock}>
          <MessagesContainer {...mockedProps} />
        </CampaignContext.Provider>
      </AuthContext.Provider>,
    );
    // NOTE: This wrapper doesn't actually do nothing. It just avoid `act` wrapper warning
    expect(await screen.findByRole('messages-container'));

    const messageToSend = JSON.stringify({
      type: faker.lorem.word(),
      content: MessageMock,
      status: 'ok',
    });
    server.send(messageToSend);

    expect(document.body).not.toContain(MessageMock.message);
  });
});
