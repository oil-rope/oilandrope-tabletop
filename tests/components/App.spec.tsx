import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import React from 'react';
import { render, screen } from '@testing-library/react';

import App from '@Components/App';

import { UserMock, BotMock } from '../__mocks__/helper';

beforeAll(() => {
  enableFetchMocks();
  window.alert = jest.fn();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('App suite', () => {
  it('renders correctly', async () => {
    const { container } = render(<App />);
    await screen.findByText('Authentication required');

    expect(container).toBeInTheDocument();
  });

  it('gets user on load', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.match(/https?:\/.+\/en\/api\/registration\/bot\/$/)) {
        return Promise.resolve(JSON.stringify(BotMock));
      } else if (
        req.url.match(/https?:\/.+\/en\/api\/registration\/user\/@me\/$/)
      ) {
        return Promise.resolve(JSON.stringify(UserMock));
      }
      return Promise.resolve({ body: 'Not found', status: 404 });
    });
    render(<App />);
    expect(
      await screen.findByText('Authentication required'),
    ).toBeInTheDocument();

    expect(fetchMock).toBeCalledTimes(1);
  });
});
