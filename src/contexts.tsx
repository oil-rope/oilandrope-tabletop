import { createContext } from 'react';

import { IBot, ISession, IUser } from '@Interfaces';

interface IAuthContext {
  user: IUser | null;
  bot: IBot | null;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);
export const SessionContext = createContext<ISession | null>(null);
