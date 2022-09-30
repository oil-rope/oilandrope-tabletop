import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { tabletopRender } from '@Components/testUtils';

import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { faker } from '@faker-js/faker';
import { campaignMock, paginatedMessagesMock } from '@/__mocks__';

import { CampaignContext } from '@Contexts';
import { IPaginatedChatMessageList } from '@Interfaces';

import { MessagesContainer } from '..';

let divContainer: HTMLElement | null = null;
let WebSocketMock: jest.Mock;

beforeAll(() => {
  WebSocketMock = jest.fn();
});

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
        chatWebSocket={new WebSocketMock()}
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
        chatWebSocket={new WebSocketMock()}
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
          chatWebSocket={new WebSocketMock()}
        />
      </CampaignContext.Provider>,
      { container: divContainer },
    );

    await waitFor(async () => await screen.findAllByText('Loading user...'));

    const msgText = MessagesListMock.results[0].message;
    expect(screen.queryByText(msgText)).not.toBeInTheDocument();
  });

  test("raise an alert if messages can't be retrieved", () => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });

    jest.spyOn(global, 'alert').mockImplementation((msg) => {
      console.log(msg);
    });

    tabletopRender(
      <MessagesContainer
        height={faker.datatype.number()}
        chatWebSocket={new WebSocketMock()}
      />,
      { container: divContainer },
    );

    expect(screen.queryByRole('message')).not.toBeInTheDocument();
  });

  test('renders messages if campaign and user are given', async () => {
    tabletopRender(
      <MessagesContainer
        height={faker.datatype.number()}
        chatWebSocket={new WebSocketMock()}
      />,
      { container: divContainer },
    );

    const msgText = MessagesListMock.results[0].message;

    await waitFor(() => expect(fetchMock).toBeCalledTimes(1));

    const messagesContainerElement = await screen.findByText(msgText);
    expect(messagesContainerElement).toBeInTheDocument();
  });
});
