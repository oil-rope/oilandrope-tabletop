import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import React from 'react';
import { render, screen } from '@testing-library/react';

import App from '@Components/App';

import { UserMock } from '../__mocks__/helper';

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
    fetchMock.mockResponseOnce(JSON.stringify(UserMock));

    render(<App />);
    expect(
      await screen.findByText(
        'The element you are looking for does not exist.',
      ),
    ).toBeInTheDocument();

    expect(fetchMock).toBeCalledTimes(1);
    // NOTE: Not given user credentials so alert is called
    expect(window.alert).toBeCalledTimes(1);
  });
});
