import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import {
  IBot,
  IChat,
  IChatMessage,
  ICampaign,
  ISimpleUser,
  IUser,
} from '../../src/interfaces';

export const emptyFunc = () => null;

/**
 * Creates a simple user object with random data.
 *
 * @returns {ISimpleUser} User created.
 */
export const simpleUserFactory = (): ISimpleUser => {
  const user: ISimpleUser = {
    id: faker.datatype.number(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
  };
  return user;
};
export const SimpleUserMock: ISimpleUser = simpleUserFactory();

/**
 * Creates a user object with random data.
 *
 * @returns {IUser} User created.
 */
export const userFactory = (): IUser => {
  const userId: number = faker.datatype.number();
  const user: IUser = {
    id: userId,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    is_active: faker.datatype.boolean(),
    is_premium: faker.datatype.boolean(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    last_login: dayjs(faker.date.past()).toISOString(),
    date_joined: dayjs(faker.date.past()).toISOString(),
    token: faker.internet.password(),
    profile: {
      user: userId,
      bio: faker.lorem.paragraphs(),
      birthday: dayjs(faker.date.past()).toISOString(),
      language: 'en',
      image: faker.image.imageUrl(),
      web: faker.internet.url(),
    },
  };
  return user;
};
export const UserMock: IUser = userFactory();

/**
 * Creates a bot object with random data.
 *
 * @returns {IBot} Bot created.
 */
export const botFactory = (): IBot => ({
  id: faker.datatype.number(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  command_prefix: faker.random.word(),
  description: faker.lorem.paragraph(),
});
export const BotMock: IBot = botFactory();

/**
 * Creates a message object with random data. This also creates a fake author.
 *
 * @returns {IChatMessage} Message created.
 */
export const messageFactory = (): IChatMessage => {
  const message: IChatMessage = {
    id: faker.datatype.number(),
    chat: faker.datatype.number(),
    message: faker.lorem.paragraph(),
    author: simpleUserFactory(),
    entry_created_at: dayjs(faker.date.recent()).toISOString(),
    entry_updated_at: dayjs(faker.date.past()).toISOString(),
    roll: undefined,
  };
  return message;
};
export const MessageMock: IChatMessage = messageFactory();

export const messageWithRollFactory = (params = {}): IChatMessage => {
  const nDices: number = faker.datatype.number({ min: 1, max: 4 });
  const diceSides: number = faker.datatype.number({ min: 2, max: 20 });
  const rollKey = `${nDices}d${diceSides}`;
  let mockedObj = {
    id: faker.datatype.number(),
    chat: faker.datatype.number(),
    message: faker.lorem.paragraph(),
    author: simpleUserFactory(),
    entry_created_at: dayjs(faker.date.recent()).toISOString(),
    entry_updated_at: dayjs(faker.date.past()).toISOString(),
    roll: {
      [rollKey]: Array.from({ length: nDices }, () =>
        faker.datatype.number({ min: 1, max: diceSides }),
      ),
    },
  };
  mockedObj = Object.assign(mockedObj, params);
  return mockedObj;
};
export const MessageWithRollMock: IChatMessage = messageWithRollFactory();

export const chatFactory = (): IChat => {
  const chat: IChat = {
    id: faker.datatype.number(),
    name: faker.lorem.words(),
    users: [...Array<number>(faker.datatype.number())],
    chat_message_set: [
      ...Array<number>(faker.datatype.number({ min: 1, max: 10 })),
    ].map(() => faker.datatype.number()),
    entry_created_at: dayjs(faker.date.recent()).toISOString(),
    entry_updated_at: dayjs(faker.date.past()).toISOString(),
  };
  return chat;
};
export const ChatMock: IChat = chatFactory();

export const sessionFactory = (): ICampaign => {
  const session: ICampaign = {
    id: faker.datatype.number(),
    name: faker.lorem.words(),
    owner: faker.datatype.number(),
    users: [...Array<number>(faker.datatype.number({ min: 1, max: 10 }))],
    place: faker.datatype.number(),
    chat: faker.datatype.number(),
    entry_created_at: dayjs(faker.date.past()).toISOString(),
    entry_updated_at: dayjs(faker.date.recent()).toISOString(),
  };
  return session;
};
export const SessionMock: ICampaign = sessionFactory();
