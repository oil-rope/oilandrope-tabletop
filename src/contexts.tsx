import { createContext } from 'react';

import { IBot, ICampaign, IUser } from '@Interfaces';

interface IAuthContext {
  user: IUser | null;
  bot: IBot | null;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  bot: null,
});
export const CampaignContext = createContext<ICampaign | null>(null);
