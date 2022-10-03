import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { tokenResponseMock } from '@/__mocks__';

import LoginModal from '../LoginModal';

beforeAll(() => {
  enableFetchMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('LoginModal suite', () => {
  test('renders correctly', async () => {
    render(<LoginModal onLogin={jest.fn} onFail={jest.fn} />);

    const modalElement = await screen.findByText('Authentication required');
    expect(modalElement).toBeInTheDocument();
  });

  test('tries to login with incorrect credentials and calls onFail', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        non_field_errors: ['Cannot login with given credentials'],
      }),
      { status: 400 },
    );
    const onFailFn = jest.fn();

    render(<LoginModal onLogin={jest.fn} onFail={onFailFn} />);

    await userEvent.type(
      await screen.findByLabelText('Username or email'),
      faker.internet.userName(),
    );
    await userEvent.type(
      await screen.findByLabelText('Password'),
      faker.internet.password(),
    );
    await userEvent.click(await screen.findByText('Login'));

    await waitFor(() => expect(fetchMock).toBeCalledTimes(1));

    expect(onFailFn).toBeCalledTimes(1);
  });

  test('logins correctly and calls onLogin', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(tokenResponseMock()), {
      status: 200,
    });
    const onLoginFn = jest.fn();

    render(<LoginModal onLogin={onLoginFn} onFail={jest.fn} />);

    await userEvent.type(
      await screen.findByLabelText('Username or email'),
      faker.internet.userName(),
    );
    await userEvent.type(
      await screen.findByLabelText('Password'),
      faker.internet.password(),
    );
    await userEvent.click(await screen.findByText('Login'));

    await waitFor(() => expect(fetchMock).toBeCalledTimes(1));

    expect(onLoginFn).toBeCalledTimes(1);
  });
});
