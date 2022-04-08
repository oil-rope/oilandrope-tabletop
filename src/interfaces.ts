export interface ISimpleUser {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export interface IUser extends ISimpleUser {
  last_login: string;
  is_active: boolean;
  date_joined: string;
  is_premium: boolean;
  profile: IProfile;
  token: string;
}

export interface IProfile {
  user: number;
  bio: string | null;
  birthday: string | null;
  language: string | null;
  web: string | null;
  image: string | null;
}

export interface IChat {
  id: number;
  name: string;
  users: Array<number>;
  chat_message_set: Array<IMessage>;
  entry_created_at: string;
  entry_updated_at: string;
}

export interface IMessage {
  id: number;
  chat: number;
  message: string;
  author: ISimpleUser;
  entry_created_at: string;
  entry_updated_at: string;
  roll: Record<string, Array<number>> | null;
}

export interface ISession {
  id: number;
  name: string;
  players: Array<number>;
  chat: number;
  next_game: string;
  system: number;
  world: number;
  game_masters: Array<number>;
}
