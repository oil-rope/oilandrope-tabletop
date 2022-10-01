import React from 'react';
import { render, screen } from '@testing-library/react';
import { tabletopRender } from '@Components/__tests__/testUtils';

import WS from 'jest-websocket-mock';

import { CHAT_WEBSOCKET } from '@Constants';

import Chat from '../Chat';

describe('Chat suite without context', () => {
  test('renders correctly', async () => {
    render(<Chat />);

    const loadingElement = await screen.findAllByText('Connecting chat...');
    expect(loadingElement).toHaveLength(2);
  });
});

describe('Chat suite with WebSocket', () => {
  new WS(CHAT_WEBSOCKET);

  test('renders correctly', async () => {
    tabletopRender(<Chat />);

    const inputElement = await screen.findByPlaceholderText('Start typing...');
    expect(inputElement).toBeInTheDocument();
  });
});
