import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, screen } from '@testing-library/react';
import {
  authRender,
  CampaignMock,
  server,
  setUpWebSocket,
  tabletopRender,
  tearDownWebSocket,
  UserMock,
} from './testUtils';

import { faker } from '@faker-js/faker';

import { WebSocketTypes } from '../interfaces';

import Chat from '../Chat';

let divContainer: HTMLDivElement;

beforeAll(() => {
  window.alert = jest.fn();
});

beforeEach(async () => {
  divContainer = document.createElement('div');
  document.body.appendChild(divContainer);

  await setUpWebSocket();
});

afterAll(() => {
  (window.alert as jest.Mock).mockReset();
});

afterEach(() => {
  unmountComponentAtNode(divContainer);
  divContainer.remove();
  divContainer = null;

  tearDownWebSocket();
});

describe('Chat suite without context', () => {
  test('renders correctly', async () => {
    render(<Chat />);

    const loadingElements = await screen.findAllByText('Connecting chat...');
    expect(loadingElements).toHaveLength(2);
  });

  test('gets height from canvas', async () => {
    divContainer.setAttribute('style', JSON.stringify({ height: '1080px' }));
    const canvasContainer = document.createElement('canvas');
    canvasContainer.id = 'tabletopCanvasContainer';
    canvasContainer.height = 1080;
    divContainer.appendChild(canvasContainer);

    const { container } = render(<Chat />, { container: divContainer });

    const containerElement = container.firstChild;
    // NOTE: Since `jsdom` doesn't actually render anything it won't get actual height so it will always
    // be 0
    expect(containerElement).toHaveStyle({ maxHeight: '0px' });
  });
});

describe('Chat suite with WebSocket', () => {
  test('renders correctly', async () => {
    tabletopRender(<Chat />);

    const inputElement = await screen.findByPlaceholderText('Start typing...');
    expect(inputElement).toBeInTheDocument();
  });

  test('websocket is not opened if campaign is not given', async () => {
    authRender(<Chat />);

    const loadingElements = await screen.findAllByText('Connecting chat...');
    expect(loadingElements).toHaveLength(2);
  });

  test('websocket receives connect message on render', async () => {
    window.confirm = jest.fn();

    tabletopRender(<Chat />);
    await server.connected;

    const wsConnectMessage = {
      type: 'setup_channel_layer',
      token: UserMock.token,
      chat: CampaignMock.chat,
    } as { type: WebSocketTypes; token: string; chat: number };

    await expect(server).toReceiveMessage(JSON.stringify(wsConnectMessage));

    server.close();
    (window.confirm as jest.Mock).mockReset();
  });

  test('window is popped on websocket forced disconnection', async () => {
    jest.spyOn(global, 'confirm').mockReturnValue(true);

    tabletopRender(<Chat />);
    await server.connected;

    server.close({
      code: faker.datatype.number(),
      reason: faker.lorem.sentence(),
      wasClean: false,
    });

    expect(confirm).toBeCalledTimes(1);
    expect(confirm).toBeCalledWith("You've been disconnected. Reconnect?");

    (global.confirm as jest.Mock).mockReset();
  });

  test('window is not popped on websocket clean disconnection', async () => {
    jest.spyOn(global, 'confirm').mockReturnValue(true);

    tabletopRender(<Chat />);
    await server.connected;

    server.close({
      code: faker.datatype.number(),
      reason: faker.lorem.sentence(),
      wasClean: true,
    });

    expect(confirm).toBeCalledTimes(0);

    (global.confirm as jest.Mock).mockReset();
  });
});
