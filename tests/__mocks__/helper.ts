import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import { IChat, IMessage, ISession, ISimpleUser, IUser } from '@Interfaces';

export const emptyFunc = () => null;

export const SimpleUserMock: ISimpleUser = {
  id: faker.datatype.number(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  first_name: null,
  last_name: null,
};

export const UserMock: IUser = {
  id: faker.datatype.number(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  is_active: true,
  is_premium: false,
  first_name: null,
  last_name: null,
  last_login: dayjs(faker.date.recent()).format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
  date_joined: dayjs(faker.date.past()).format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
  token: faker.internet.password(),
  profile: {
    user: 1,
    bio: faker.lorem.paragraph(),
    birthday: dayjs(faker.date.past()).format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
    language: faker.random.locale(),
    image: null,
    web: faker.internet.url(),
  },
};

export const SessionMock: ISession = {
  id: faker.datatype.number(),
  name: faker.lorem.words(),
  players: [],
  chat: faker.datatype.number(),
  next_game: dayjs(faker.date.future()).format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
  system: faker.datatype.number(),
  world: faker.datatype.number(),
  game_masters: [],
};

export const MessageMock: IMessage = {
  id: faker.datatype.number(),
  chat: faker.datatype.number(),
  message: faker.lorem.words(),
  author: SimpleUserMock,
  entry_created_at: dayjs(faker.date.recent()).format(
    'YYYY-MM-DDTHH:mm:ssZ[Z]',
  ),
  entry_updated_at: dayjs(faker.date.past()).format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
};

export const ChatMock: IChat = {
  id: faker.datatype.number(),
  name: faker.lorem.words(),
  users: [...Array<number>(faker.datatype.number())],
  chat_message_set: [],
  entry_created_at: dayjs(faker.date.past()).format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
  entry_updated_at: dayjs(faker.date.recent()).format(
    'YYYY-MM-DDTHH:mm:ssZ[Z]',
  ),
};
