import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import { IChat, IMessage, ISession, ISimpleUser, IUser } from '@Interfaces';

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
      language: faker.random.locale(),
      image: faker.image.imageUrl(),
      web: faker.internet.url(),
    },
  };
  return user;
};
export const UserMock: IUser = userFactory();

/**
 * Creates a message object with random data. This also creates a fake author.
 *
 * @returns {IMessage} Message created.
 */
export const messageFactory = (): IMessage => {
  const message: IMessage = {
    id: faker.datatype.number(),
    chat: faker.datatype.number(),
    message: faker.lorem.paragraph(),
    author: simpleUserFactory(),
    entry_created_at: dayjs(faker.date.recent()).toISOString(),
    entry_updated_at: dayjs(faker.date.past()).toISOString(),
  };
  return message;
};
export const MessageMock: IMessage = messageFactory();

export const chatFactory = (): IChat => {
  const chat: IChat = {
    id: faker.datatype.number(),
    name: faker.lorem.words(),
    users: [...Array<number>(faker.datatype.number())],
    chat_message_set: [
      ...Array<number>(faker.datatype.number({ min: 1, max: 10 })),
    ].map(() => messageFactory()),
    entry_created_at: dayjs(faker.date.recent()).toISOString(),
    entry_updated_at: dayjs(faker.date.past()).toISOString(),
  };
  return chat;
};
export const ChatMock: IChat = chatFactory();

export const sessionFactory = (): ISession => {
  const session: ISession = {
    id: faker.datatype.number(),
    name: faker.lorem.words(),
    players: [...Array<number>(faker.datatype.number({ min: 1, max: 10 }))],
    chat: faker.datatype.number(),
    next_game: dayjs(faker.date.future()).toISOString(),
    system: faker.datatype.number(),
    world: faker.datatype.number(),
    game_masters: [
      ...Array<number>(faker.datatype.number({ min: 1, max: 10 })),
    ],
  };
  return session;
};
export const SessionMock: ISession = sessionFactory();
