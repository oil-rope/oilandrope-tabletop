import { createContext } from 'react';

import { ISession, IUser } from '@Interfaces';

export const AuthContext = createContext<IUser | null>(null);
export const SessionContext = createContext<ISession | null>(null);
