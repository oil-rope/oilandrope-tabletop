import { createContext } from 'react';

export interface IAuthUserContext {
  id: number;
  username: string;
  email: string;
  last_login: Date;
  is_active: boolean;
  is_premium: boolean;
  first_name: string;
  last_name: string;
  profile: IAuthProfileContext;
}
interface IAuthProfileContext {
  bio: string | null;
  birthday: Date | null;
  language: string;
  alias: string;
  web: string;
  image: string | null;
}

const defaultAuthContext = null;

export const AuthContext = createContext<IAuthUserContext | null>(
  defaultAuthContext,
);
