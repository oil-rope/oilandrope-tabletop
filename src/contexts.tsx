import { createContext } from 'react';

export interface IUser {
  id: number;
  username: string;
  email: string;
  last_login: Date;
  is_active: boolean;
  is_premium: boolean;
  first_name: string | null;
  last_name: string | null;
  profile: IProfile;
}
interface IProfile {
  bio: string | null;
  birthday: Date | null;
  language: string;
  alias: string;
  web: string;
  image: string | null;
}

const defaultAuthContext = null;

export const AuthContext = createContext<IUser | null>(defaultAuthContext);
