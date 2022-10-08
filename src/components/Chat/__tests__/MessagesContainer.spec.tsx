import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, screen, waitFor } from '@testing-library/react';

import {
  BotMock,
  chatRender,
  server,
  setUpWebSocket,
  tearDownWebSocket,
  UserMock,
} from './testUtils';

import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { faker } from '@faker-js/faker';
import { campaignMock, messageMock, paginatedMessagesMock } from '@/__mocks__';

import { WS_TYPES } from '@Constants';

import { IPaginatedChatMessageList } from '@Interfaces';
import { IWSServerChatMessage } from '../interfaces';

import { CampaignContext } from '@Contexts';
import { ChatContext } from '../context';

import { MessagesContainer } from '..';

let divContainer: HTMLElement | null = null;

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

beforeEach(async () => {
  divContainer = document.createElement('div');
  document.body.appendChild(divContainer);

  await setUpWebSocket();
});

afterEach(() => {
  unmountComponentAtNode(divContainer);
  divContainer.remove();
  divContainer = null;

  tearDownWebSocket();
});

afterAll(() => {
  (window.HTMLElement.prototype.scrollIntoView as jest.Mock).mockReset();
});

describe('MessagesContainer suite without Contexts suite', () => {
  test('renders correctly', () => {
    render(
      <ChatContext.Provider
        value={{ colorMap: {}, chatWebSocket: new (jest.fn())() }}
      >
        <MessagesContainer height={faker.datatype.number()} />
      </ChatContext.Provider>,
      {
        container: divContainer,
      },
    );
  });
});

describe('MessagesContainer suite with CampaignContext suite', () => {
  let MessagesListMock: IPaginatedChatMessageList;

  beforeAll(() => {
    enableFetchMocks();
  });

  beforeEach(() => {
    MessagesListMock = paginatedMessagesMock();

    fetchMock.mockOnceIf(/\/oarapi\//, (req) => {
      if (req.url.match(/\/oarapi\/chat\/\d+\/messages/)) {
        return Promise.resolve(JSON.stringify(MessagesListMock));
      }
      return Promise.resolve({ body: 'Not found', status: 404 });
    });
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test("doesn't retrieve messages if campaign not given", () => {
    render(
      <ChatContext.Provider
        value={{ colorMap: {}, chatWebSocket: new (jest.fn())() }}
      >
        <MessagesContainer height={faker.datatype.number()} />
      </ChatContext.Provider>,
      {
        container: divContainer,
      },
    );

    expect(fetchMock).toBeCalledTimes(0);
  });

  test("doesn't render if campaign is given but user is not", async () => {
    render(
      <CampaignContext.Provider value={campaignMock()}>
        <ChatContext.Provider
          value={{ colorMap: {}, chatWebSocket: new (jest.fn())() }}
        >
          <MessagesContainer height={faker.datatype.number()} />
        </ChatContext.Provider>
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

    chatRender(<MessagesContainer height={faker.datatype.number()} />, {
      container: divContainer,
    });

    await waitFor(() => expect(alert).toBeCalledTimes(1));

    (window.alert as jest.Mock).mockReset();
  });

  test('renders messages if campaign and user are given', async () => {
    chatRender(<MessagesContainer height={faker.datatype.number()} />, {
      container: divContainer,
    });

    const msgText = MessagesListMock.results[0].message;

    await waitFor(() => expect(fetchMock).toBeCalledTimes(1));

    const messagesContainerElement = await screen.findByText(msgText);
    expect(messagesContainerElement).toBeInTheDocument();
  });
});

describe('MessagesContainer suite with WebSocket', () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  afterAll(() => {
    (window.alert as jest.Mock).mockReset();
  });

  beforeEach(async () => {
    await server.connected;
  });

  test('messages are appended to container on send', async () => {
    chatRender(<MessagesContainer height={faker.datatype.number()} />, {
      container: divContainer,
    });

    const msgText = faker.lorem.paragraph();
    const MessageMock = messageMock({ author: UserMock, message: msgText });

    const wsReceiveMsg: IWSServerChatMessage = {
      type: WS_TYPES.RECEIVE_MESSAGE,
      content: MessageMock,
      chat: MessageMock.chat,
    };
    server.send(JSON.stringify(wsReceiveMsg));

    const messageElement = await screen.findByText(msgText);
    expect(messageElement).toBeInTheDocument();
  });

  test('messages from bot are appended to container on send', async () => {
    chatRender(<MessagesContainer height={faker.datatype.number()} />, {
      container: divContainer,
    });

    const MessageMock = messageMock({ author: BotMock });

    const wsReceiveMsg: IWSServerChatMessage = {
      type: WS_TYPES.RECEIVE_MESSAGE,
      content: MessageMock,
      chat: MessageMock.chat,
    };
    server.send(JSON.stringify(wsReceiveMsg));

    const messageElement = await screen.findByText(MessageMock.message);
    expect(messageElement).toBeInTheDocument();
  });

  test('messages from bot (roll) are appended to container on send', async () => {
    chatRender(<MessagesContainer height={faker.datatype.number()} />, {
      container: divContainer,
    });

    const RollMessageMock = messageMock({
      roll: { '2d6': [4, 1], '+3': [3], '-1': [-1] },
      author: BotMock,
      message: '7',
    });

    const wsReceiveMsg: IWSServerChatMessage = {
      type: WS_TYPES.RECEIVE_MESSAGE,
      content: RollMessageMock,
      chat: RollMessageMock.chat,
      roll: RollMessageMock.roll,
    };
    server.send(JSON.stringify(wsReceiveMsg));

    const expectedAlt = Object.entries(RollMessageMock.roll)
      .map(([key, value]) => `${key}: [${value}]`)
      .join(', ');
    const messageElement = await screen.findByTitle(expectedAlt);
    expect(messageElement).toBeInTheDocument();
  });
});
