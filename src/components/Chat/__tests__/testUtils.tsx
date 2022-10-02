import React, { FC, ReactElement, useRef } from 'react';
import { RenderOptions, render } from '@testing-library/react';
import { TabletopProviders } from '@Components/__tests__/testUtils';

import WS from 'jest-websocket-mock';

import { CHAT_WEBSOCKET } from '@Constants';

import { ChatContext, ColorMapTypes } from '../context';

export const server = new WS(CHAT_WEBSOCKET);
export const chatWebSocket = new WebSocket(CHAT_WEBSOCKET);

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
