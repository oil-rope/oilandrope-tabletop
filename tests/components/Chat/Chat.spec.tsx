import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import React from 'react';
import { render, screen } from '@testing-library/react';

import { AuthContext, SessionContext } from '@Contexts';

import Chat from '@Components/Chat/Chat';

import {
  UserMock,
  SessionMock,
  ChatMock,
  MessageMock,
} from '../../__mocks__/helper';

beforeAll(() => {
  enableFetchMocks();
});

beforeEach(() => {
  fetchMock.mockResponse((req) => {
    if (req.url.match(/https?:\/.+\/en\/api\/chat\/chat\/.+\/$/)) {
      const chatMock = Object.assign({}, ChatMock);
      chatMock.chat_message_set = [MessageMock];
      return Promise.resolve(JSON.stringify(chatMock));
    } else if (
      req.url.match(/https?:\/.+\/en\/api\/registration\/user\/@me\/$/)
    ) {
      return Promise.resolve(JSON.stringify(UserMock));
    }
    return Promise.resolve({ body: 'Not found', status: 404 });
  });
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('Chat suite', () => {
  it('gets loading if user is not given', () => {
    render(<Chat />);
    const elementsRendered = screen.getAllByText('Connecting chat...');

    // There should be 2, one for user and one for visually-hidden
    expect(elementsRendered.length).toEqual(2);
  });

  it('gets loading if session is not given (but user is)', () => {
    render(
      <AuthContext.Provider value={UserMock}>
        <Chat />
      </AuthContext.Provider>,
    );
    const elementsRendered = screen.getAllByText('Connecting chat...');

    // There should be 2, one for user and one for visually-hidden
    expect(elementsRendered.length).toEqual(2);
  });

  it('renders correctly', async () => {
    const { container } = render(
      <AuthContext.Provider value={UserMock}>
        <SessionContext.Provider value={SessionMock}>
          <Chat />
        </SessionContext.Provider>
      </AuthContext.Provider>,
    );
    // NOTE: There are no messages, this is just a work-around
    expect(
      await screen.findByPlaceholderText('Start typing...'),
    ).toBeInTheDocument();

    expect(container).toBeInTheDocument();
  });

  it('renders messages on load', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.match(/https?:\/.+\/en\/api\/chat\/chat\/.+\/$/)) {
        const chatMock = Object.assign({}, ChatMock);
        chatMock.chat_message_set = [MessageMock];
        return Promise.resolve(JSON.stringify(chatMock));
      } else if (
        req.url.match(/https?:\/.+\/en\/api\/registration\/user\/@me\/$/)
      ) {
        return Promise.resolve(JSON.stringify(UserMock));
      }
      return Promise.resolve({ body: 'Not found', status: 404 });
    });
    render(
      <AuthContext.Provider value={UserMock}>
        <SessionContext.Provider value={SessionMock}>
          <Chat />
        </SessionContext.Provider>
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(MessageMock.message)).toBeInTheDocument();
  });
});
