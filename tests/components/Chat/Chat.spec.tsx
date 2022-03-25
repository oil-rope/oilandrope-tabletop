import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import React from 'react';
import { render, act } from '@testing-library/react';

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

afterEach(() => {
  fetchMock.resetMocks();
});

describe('Chat suite', () => {
  it('gets loading if user is not given', () => {
    const { getAllByText } = render(<Chat />);
    const elementsRendered = getAllByText('Connecting chat...');

    // There should be 2, one for user and one for visually-hidden
    expect(elementsRendered.length).toEqual(2);
  });

  it('gets loading if session is not given (but user is)', () => {
    const { getAllByText } = render(
      <AuthContext.Provider value={UserMock}>
        <Chat />
      </AuthContext.Provider>,
    );
    const elementsRendered = getAllByText('Connecting chat...');

    // There should be 2, one for user and one for visually-hidden
    expect(elementsRendered.length).toEqual(2);
  });

  it('renders correctly', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.match(/https?:\/.+\/en\/api\/chat\/chat\/.+\/$/)) {
        return Promise.resolve(JSON.stringify(ChatMock));
      } else if (
        req.url.match(/https?:\/.+\/en\/api\/registration\/user\/@me\/$/)
      ) {
        return Promise.resolve(JSON.stringify(UserMock));
      }
      return Promise.resolve({ body: 'Not found', status: 404 });
    });
    const { container } = render(
      <AuthContext.Provider value={UserMock}>
        <SessionContext.Provider value={SessionMock}>
          <Chat />
        </SessionContext.Provider>
      </AuthContext.Provider>,
    );
    // NOTE: There are no messages, this is just a work-around
    await act(async () => {});

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
    const { findByText } = render(
      <AuthContext.Provider value={UserMock}>
        <SessionContext.Provider value={SessionMock}>
          <Chat />
        </SessionContext.Provider>
      </AuthContext.Provider>,
    );

    expect(await findByText(MessageMock.message)).toBeInTheDocument();
  });
});
