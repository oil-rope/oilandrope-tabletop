export interface ISimpleUser {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
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
  author: ISimpleUser | number;
  entry_created_at: string;
  entry_updated_at: string;
}
