import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { tabletopRender, UserMock } from '@Components/testUtils';

import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import WS from 'jest-websocket-mock';

import { faker } from '@faker-js/faker';
import { campaignMock, messageMock, paginatedMessagesMock } from '@/__mocks__';

import { CHAT_WEBSOCKET, WS_TYPES } from '@Constants';
import { CampaignContext } from '@Contexts';
import { IPaginatedChatMessageList } from '@Interfaces';
import { IWSReceiveChatMessage, IWSSendChatMessage } from '../interfaces';

import { MessagesContainer } from '..';

let divContainer: HTMLElement | null = null;

beforeEach(() => {
  divContainer = document.createElement('div');
  document.body.appendChild(divContainer);
});

afterEach(() => {
  unmountComponentAtNode(divContainer);
  divContainer.remove();
  divContainer = null;
});

describe('MessagesContainer without Contexts suite', () => {
  test('renders correctly', () => {
    render(
      <MessagesContainer
        height={faker.datatype.number()}
        chatWebSocket={new (jest.fn())()}
      />,
      { container: divContainer },
    );
  });
});

describe('MessagesContainer with CampaignContext suite', () => {
  let MessagesListMock: IPaginatedChatMessageList;

  beforeAll(() => {
    enableFetchMocks();
  });

  beforeEach(() => {
    MessagesListMock = paginatedMessagesMock();

    fetchMock.mockOnceIf(/.+\/api\/chat\/\d+\/messages/, () => {
      return Promise.resolve(JSON.stringify(MessagesListMock));
    });
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test("doesn't retrieve messages if campaign not give", () => {
    render(
      <MessagesContainer
        height={faker.datatype.number()}
        chatWebSocket={new (jest.fn())()}
      />,
      { container: divContainer },
    );

    expect(fetchMock).toBeCalledTimes(0);
  });

  test("doesn't render if campaign is given but user is not", async () => {
    render(
      <CampaignContext.Provider value={campaignMock()}>
        <MessagesContainer
          height={faker.datatype.number()}
          chatWebSocket={new (jest.fn())()}
        />
      </CampaignContext.Provider>,
      { container: divContainer },
    );

    await waitFor(async () => await screen.findAllByText('Loading user...'));

    const msgText = MessagesListMock.results[0].message;
    expect(screen.queryByText(msgText)).not.toBeInTheDocument();
  });

  test("raise an alert if messages can't be retrieved", async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });

    window.alert = jest.fn();

    tabletopRender(
      <MessagesContainer
        height={faker.datatype.number()}
        chatWebSocket={new (jest.fn())()}
      />,
      { container: divContainer },
    );

    await waitFor(() => expect(alert).toBeCalledTimes(1));

    (window.alert as jest.Mock).mockReset();
  });

  test('renders messages if campaign and user are given', async () => {
    tabletopRender(
      <MessagesContainer
        height={faker.datatype.number()}
        chatWebSocket={new (jest.fn())()}
      />,
      { container: divContainer },
    );

    const msgText = MessagesListMock.results[0].message;

    await waitFor(() => expect(fetchMock).toBeCalledTimes(1));

    const messagesContainerElement = await screen.findByText(msgText);
    expect(messagesContainerElement).toBeInTheDocument();
  });
});

describe('MessagesContainer with WebSocket', () => {
  let server: WS;
  let chatWebSocket: WebSocket;

  beforeAll(() => {
    window.alert = jest.fn();
  });

  afterAll(() => {
    (window.alert as jest.Mock).mockReset();
  });

  beforeEach(async () => {
    server = new WS(CHAT_WEBSOCKET);
    chatWebSocket = new WebSocket(CHAT_WEBSOCKET);
    await server.connected;
  });

  afterEach(() => {
    WS.clean();
  });

  test('messages are appended to container on send', async () => {
    tabletopRender(
      <MessagesContainer
        height={faker.datatype.number()}
        chatWebSocket={chatWebSocket}
      />,
      { container: divContainer },
    );

    const msgText = faker.lorem.paragraph();
    const MessageMock = messageMock({ author: UserMock, message: msgText });

    const wsSendMsg = JSON.stringify({
      type: WS_TYPES.SEND_MESSAGE,
      message: msgText,
      chat: MessageMock.chat,
    } as IWSSendChatMessage);
    chatWebSocket.send(wsSendMsg);
    await expect(server).toReceiveMessage(wsSendMsg);

    const wsReceiveMsg = JSON.stringify({
      type: WS_TYPES.SEND_MESSAGE,
      content: MessageMock,
      chat: MessageMock.chat,
    } as IWSReceiveChatMessage);
    server.send(wsReceiveMsg);

    const messageElement = await screen.findByText(msgText);
    expect(messageElement).toBeInTheDocument();
  });
});
