import React, { FC, ReactElement, useRef } from 'react';
import { RenderOptions, render } from '@testing-library/react';
import { TabletopProviders } from '@Components/__tests__/testUtils';

import WS from 'jest-websocket-mock';

import { CHAT_WEBSOCKET } from '@Constants';

import { ChatContext, ColorMapTypes } from '../context';

export let server: WS;
export let chatWebSocket: WebSocket;

/**
 * In order configure websocket only when needed we declare a setUp.
 * Remember to call {@link tearDownWebSocket}.
 *
 * @param {string} url URL from where to start the WebSocket.
 */
export const setUpWebSocket = async (url: string = CHAT_WEBSOCKET) => {
  server = new WS(url);
  chatWebSocket = new WebSocket(url);
  await server.connected;
};

/**
 * This method will close both webSocket and server mock. Also it will clean
 * all mocked responses.
 */
export const tearDownWebSocket = () => {
  if (chatWebSocket !== undefined) {
    chatWebSocket.close();
  }

  if (server !== undefined) {
    server.close();
    WS.clean();
  }
};

export const ChatProviders: FC<{ children: ReactElement }> = ({ children }) => {
  const colorMap = useRef<ColorMapTypes>({});

  return (
    <TabletopProviders>
      <ChatContext.Provider
        value={{
          colorMap: colorMap.current,
          chatWebSocket,
        }}
      >
        {children}
      </ChatContext.Provider>
    </TabletopProviders>
  );
};

export const chatRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: ChatProviders, ...options });

export {
  authRender,
  BotMock,
  CampaignMock,
  UserMock,
  tabletopRender,
} from '@Components/__tests__/testUtils';
