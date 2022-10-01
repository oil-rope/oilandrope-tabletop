import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, screen } from '@testing-library/react';
import { tabletopRender } from '@Components/__tests__/testUtils';

import { ChatInput } from '..';

const DummyWS = new WebSocket('ws://dummy.url.com');
let divContainer: HTMLDivElement;

beforeEach(() => {
  divContainer = document.createElement('div');
  document.body.appendChild(divContainer);
});

afterEach(() => {
  unmountComponentAtNode(divContainer);
  divContainer.remove();
  divContainer = null;
});

describe('ChatInput suite without context', () => {
  test('renders correctly', () => {
    render(<ChatInput chatWebSocket={DummyWS} />, { container: divContainer });
  });
});

describe('ChatInput suite with ', () => {
  test('renders correctly', async () => {
    tabletopRender(<ChatInput chatWebSocket={DummyWS} />, {
      container: divContainer,
    });

    const textInputEl = await screen.findByPlaceholderText('Start typing...');
    expect(textInputEl).toBeInTheDocument();
  });
});
