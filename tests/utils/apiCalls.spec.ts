import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { IUser } from '@Interfaces';
import { loadUser } from '@Utils/apiCalls';

const userMock: IUser = {
  id: 1,
  username: 'Oil & Rope Bot',
  email: 'oilandropeteam@gmail.com',
  is_active: true,
  is_premium: false,
  first_name: '',
  last_name: '',
  last_login: '2022-02-22T10:18:58.560468Z',
  date_joined: '2022-02-22T10:18:58.560468Z',
  token: 's3cr3tT0k3n@',
  profile: {
    user: 1,
    bio: null,
    birthday: null,
    language: 'en',
    image: null,
    web: '',
  },
};

beforeAll(() => {
  enableFetchMocks();
});

describe('loadUser suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify(userMock));
    const callbackFn = jest.fn();

    loadUser(callbackFn);

    expect(fetchMock.mock.calls.length).toBe(1);
  });
});
