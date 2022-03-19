import { createContext } from 'react';

import { IUser } from '@/interfaces';

const defaultAuthContext = null;

export const AuthContext = createContext<IUser | null>(defaultAuthContext);
