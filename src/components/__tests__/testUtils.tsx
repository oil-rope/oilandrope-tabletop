import React, { FC, ReactElement } from 'react';
import { RenderOptions, render } from '@testing-library/react';

import { botMock, campaignMock, userMock } from '@/__mocks__';

import { AuthContext, CampaignContext } from '@Contexts';

export const UserMock = userMock();
export const BotMock = botMock();
export const CampaignMock = campaignMock();

export const AuthProvider: FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: UserMock, bot: BotMock }}>
      {children}
    </AuthContext.Provider>
  );
};

export const TabletopProviders: FC<{ children: ReactElement }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <CampaignContext.Provider value={CampaignMock}>
        {children}
      </CampaignContext.Provider>
    </AuthProvider>
  );
};

/**
 * Custom render that will return a JSX under AuthContext.
 * In order to get the logged user and bot you can import them from this very package.
 */
export const authRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AuthProvider, ...options });

/**
 * Custom render that will return a JSX under AuthContext and CampaignContext.
 * In order to get the logged user and bot you can import them from this very package.
 */
export const tabletopRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: TabletopProviders, ...options });
