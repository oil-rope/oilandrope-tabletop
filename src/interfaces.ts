interface IPaginated {
  count: number;
  next?: string;
  previous?: string;
  results: Array<unknown>;
}

export interface IApiVersion {
  version: string;
  powered_by: string;
  drf_version: string;
  using_version: string | null;
}

export interface IAuthTokenRequest {
  username: string;
  password: string;
}

export interface IAuthTokenResponse {
  readonly token: string;
}

export interface IBot {
  readonly id: number;
  username: string;
  email: string;
  readonly command_prefix: string;
  readonly description: string;
}

export interface ICampaign {
  readonly id: number;
  name: string;
  description?: string;
  summary?: string;
  cover_image?: string;
  owner: number;
  users: Array<number>;
  place: number;
  start_date?: string;
  end_date?: string;
  readonly discord_channel?: string;
  chat: number;
  readonly entry_created_at: string;
  readonly entry_updated_at: string;
}

export interface IChat {
  readonly id: number;
  name: string;
  users: Array<number>;
  chat_message_set: Array<number>;
  readonly entry_created_at: string;
  readonly entry_updated_at: string;
}

export type IRoll = Record<string, Array<number>>;

export interface IChatMessage {
  readonly id: number;
  chat: number;
  message: string;
  author: ISimpleUser | IBot;
  readonly entry_created_at: string;
  readonly entry_updated_at: string;
  // This is used by us in order to get roll into messages
  roll?: IRoll;
}

export interface IPaginatedCampaignList extends IPaginated {
  results: Array<ICampaign>;
}

export interface IPaginatedChatList extends IPaginated {
  results: Array<IChat>;
}

export interface IPaginatedChatMessageList extends IPaginated {
  results: Array<IChatMessage>;
}

export interface IProfile {
  user: number;
  bio?: string;
  birthday?: string;
  language?: 'es' | 'en';
  web?: string;
  image?: string;
}

export interface ISimpleUser {
  readonly id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
}

export interface URLResolverRequest {
  resolver: string;
  params?: Record<string, string>;
}

export interface URLResolverResponse {
  url: string;
}

export interface IUser extends ISimpleUser {
  last_login?: string;
  is_active: boolean;
  date_joined: string;
  is_premium: boolean;
  profile: IProfile;
  readonly token: string;
}
