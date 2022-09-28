import { faker } from '@faker-js/faker';
import {
  IBot,
  IChatMessage,
  IProfile,
  ISimpleUser,
  IUser,
  IRoll,
} from '@Interfaces';

export const botMock = (): IBot => ({
  id: faker.datatype.number(),
  username: 'Oil & Rope Bot',
  email: 'oilandropeteam@gmail.com',
  command_prefix: 'oar.',
  description: faker.lorem.paragraph(),
});

const simpleUserMock = (): ISimpleUser => ({
  id: faker.datatype.number(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
});

const profileMock = (id?: number): IProfile => ({
  user: id || faker.datatype.number(),
  bio: faker.lorem.paragraph(),
  birthday: faker.date.past().toISOString(),
  language: 'en',
});

export const userMock = (): IUser => {
  const user = simpleUserMock();
  const profile = profileMock(user.id);
  return {
    ...user,
    last_login: faker.date.recent().toISOString(),
    is_active: true,
    date_joined: faker.date.past().toISOString(),
    is_premium: faker.datatype.boolean(),
    profile: profile,
    token: faker.internet.password(),
  };
};

export const messageMock = (
  author?: ISimpleUser | IBot,
  roll?: IRoll,
): IChatMessage => ({
  id: faker.datatype.number(),
  chat: faker.datatype.number(),
  message: faker.lorem.sentence(),
  author: author || simpleUserMock(),
  entry_created_at: faker.date.past().toISOString(),
  entry_updated_at: faker.date.recent().toISOString(),
  roll: roll,
});
