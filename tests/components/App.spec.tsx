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
  it('renders correctly', () => {
    const { container } = render(<App />);

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
      await screen.findByText(
        'The element you are looking for does not exist.',
      ),
    ).toBeInTheDocument();

    expect(fetchMock).toBeCalledTimes(2);
  });
});
