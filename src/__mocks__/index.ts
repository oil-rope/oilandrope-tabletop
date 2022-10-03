import { faker } from '@faker-js/faker';
import {
  IAuthTokenResponse,
  IBot,
  ICampaign,
  IChatMessage,
  IPaginatedChatMessageList,
  IProfile,
  ISimpleUser,
  IUser,
} from '@Interfaces';

type Optional<T> = {
  [P in keyof T]?: T[P];
};

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

export const userMock = (defaults?: Optional<IUser>): IUser => {
  const simpleUser = simpleUserMock();
  const profile = profileMock(simpleUser.id);
  const user = {
    ...simpleUser,
    last_login: faker.date.recent().toISOString(),
    is_active: true,
    date_joined: faker.date.past().toISOString(),
    is_premium: faker.datatype.boolean(),
    profile: profile,
    token: faker.internet.password(),
  };
  return { ...user, ...defaults };
};

export const tokenResponseMock = (
  defaults?: Optional<IAuthTokenResponse>,
): IAuthTokenResponse => {
  const tokenRes = { token: faker.internet.password() };
  return { ...tokenRes, ...defaults };
};

export const messageMock = (
  defaults?: Optional<IChatMessage>,
): IChatMessage => {
  const message = {
    id: faker.datatype.number(),
    chat: faker.datatype.number(),
    message: faker.lorem.sentence(),
    author: simpleUserMock(),
    entry_created_at: faker.date.past().toISOString(),
    entry_updated_at: faker.date.recent().toISOString(),
  };
  return { ...message, ...defaults };
};

export const paginatedMessagesMock = (
  messagesDefaults?: Optional<IChatMessage>,
  defaults?: Optional<IPaginatedChatMessageList>,
): IPaginatedChatMessageList => {
  const nMessages = faker.datatype.number({ min: 1, max: 30 });
  const messages = [...Array(nMessages)].map(() =>
    messageMock({ ...messagesDefaults }),
  );
  const paginatedMessages = {
    count: nMessages,
    results: messages,
  };
  return { ...paginatedMessages, ...defaults };
};

export const campaignMock = (defaults?: Optional<ICampaign>): ICampaign => {
  const nUsers = faker.datatype.number({ min: 1, max: 7 });
  const campaign: ICampaign = {
    id: faker.datatype.number(),
    name: faker.lorem.words(5),
    description: faker.lorem.paragraphs(),
    summary: faker.lorem.paragraph(),
    cover_image: faker.internet.url(),
    owner: faker.datatype.number(),
    users: [...Array(nUsers)].map(() => faker.datatype.number()),
    place: faker.datatype.number(),
    start_date: faker.date.past().toISOString(),
    end_date: faker.date.past().toISOString(),
    discord_channel: faker.datatype.number().toString(),
    chat: faker.datatype.number(),
    entry_created_at: faker.date.past().toISOString(),
    entry_updated_at: faker.date.recent().toISOString(),
  };
  return { ...campaign, ...defaults };
};

export const responseMock = (body: unknown, statusCode = 200): Response => {
  const headers: Headers = new Headers({
    'Content-Type': 'application/json',
  });
  const response: Response = new Response(JSON.stringify(body), {
    headers: headers,
    status: statusCode,
  });
  return response;
};
