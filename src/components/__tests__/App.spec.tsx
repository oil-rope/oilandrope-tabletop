import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { faker } from '@faker-js/faker';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { botMock, userMock } from '@/__mocks__';

import App from '@Components/App';

let divContainer: HTMLElement | null = null;

beforeEach(() => {
  divContainer = document.createElement('div');
  document.body.appendChild(divContainer);

  jest.spyOn(window, 'alert');
});

afterEach(() => {
  unmountComponentAtNode(divContainer);
  divContainer.remove();
  divContainer = null;

  (window.alert as jest.Mock).mockReset();
});

describe('App suite', () => {
  test('renders correctly', async () => {
    render(<App />, { container: divContainer });

    const loginModal = await screen.findByText('Authentication required');
    expect(loginModal).toBeInTheDocument();
  });
});

describe('App suite with user fetch mock', () => {
  beforeAll(() => {
    enableFetchMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test('renders loading bot screen after fetching user', async () => {
    fetchMock.mockOnce(JSON.stringify(userMock()));

    render(<App />, { container: divContainer });

    await waitFor(() => expect(fetchMock).toBeCalledTimes(1));

    const loadingBotElements = await screen.findAllByText('Loading bot...');
    expect(loadingBotElements).toHaveLength(2);
  });

  test("calls 'alert' when failing request for getting bot", async () => {
    fetchMock.mockIf(/https?:\/\/oilandrope-project\.com\/api\//, (req) => {
      if (req.url.endsWith('/registration/user/')) {
        return Promise.resolve(JSON.stringify(userMock()));
      }
      return Promise.resolve({
        body: 'Not found',
        status: 404,
      });
    });

    render(<App />, { container: divContainer });

    await waitFor(() => expect(fetchMock).toBeCalledTimes(2));
    await waitFor(() => expect(alert).toBeCalledTimes(1));

    const loadingBotElements = await screen.findAllByText('Loading bot...');
    expect(loadingBotElements).toHaveLength(2);
  });

  test("calls 'alert' when failing on accessing credentials", async () => {
    fetchMock.mockIf(/https?:\/\/oilandrope-project\.com\/api\//, (req) => {
      if (req.url.endsWith('/auth/token/')) {
        return Promise.resolve({
          body: JSON.stringify({
            non_field_errors: ['Cannot login with given credentials'],
          }),
          status: 400,
        });
      }
      return Promise.resolve({ body: 'Forbidden', status: 403 });
    });

    render(<App />);

    await waitFor(async () =>
      expect(
        await screen.findByText('Authentication required'),
      ).toBeInTheDocument(),
    );

    await userEvent.type(
      await screen.findByLabelText('Username or email'),
      faker.internet.userName(),
    );
    await userEvent.type(
      await screen.findByLabelText('Password'),
      faker.internet.password(),
    );
    await userEvent.click(await screen.findByText('Login'));

    expect(alert).toBeCalledWith('Credentials incorrect.');
  });
});

describe('App suite with user and bot fetch mock', () => {
  beforeAll(() => {
    enableFetchMocks();
  });

  beforeEach(() => {
    fetchMock.mockIf(/https?:\/\/oilandrope-project\.com\/api\//, (req) => {
      if (req.url.endsWith('/registration/user/')) {
        return Promise.resolve(JSON.stringify(userMock()));
      }
      if (req.url.endsWith('/registration/bot/')) {
        return Promise.resolve(JSON.stringify(botMock()));
      }
      return Promise.resolve({
        body: 'Not found',
        status: 404,
      });
    });
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test('renders correctly with given user and bot', async () => {
    fetchMock.mockIf(/https?:\/\/oilandrope-project\.com\/api\//, (req) => {
      if (req.url.endsWith('/registration/user/')) {
        return Promise.resolve(JSON.stringify(userMock()));
      }
      if (req.url.endsWith('/registration/bot/')) {
        return Promise.resolve(JSON.stringify(botMock()));
      }
      return Promise.resolve({
        body: 'Not found',
        status: 404,
      });
    });

    render(<App />, { container: divContainer, wrapper: BrowserRouter });

    await waitFor(() => expect(fetchMock).toBeCalledTimes(2));

    const notFoundElement = await screen.findByText(
      'The element you are looking for does not exist.',
    );
    expect(notFoundElement).toBeInTheDocument();
  });
});

describe('App suite with react-router', () => {
  beforeAll(() => {
    enableFetchMocks();
    fetchMock.mockIf(/https?:\/\/oilandrope-project\.com\/api\/.+/, (req) => {
      if (req.url.endsWith('/registration/user/')) {
        return Promise.resolve({
          body: JSON.stringify(userMock()),
          status: 200,
        });
      }
      if (req.url.endsWith('/registration/bot/')) {
        return Promise.resolve({
          body: JSON.stringify(botMock()),
          status: 200,
        });
      }
      return Promise.resolve({ body: 'Not found', status: 404 });
    });
  });

  afterAll(() => {
    fetchMock.resetMocks();
  });

  test('moves to tabletop correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/campaign/1/']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(fetchMock).toBeCalledTimes(2));

    const loadingChatElements = await screen.findAllByText(
      'Connecting chat...',
    );
    expect(loadingChatElements).toHaveLength(2);
  });
});
