import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { IAuthUserContext } from '@Contexts';
import { loadUser } from '@Utils/apiCalls';

const userMock: IAuthUserContext = {
  id: 1,
  username: 'Oil & Rope Bot',
  email: 'oilandropeteam@gmail.com',
  is_active: true,
  is_premium: false,
  first_name: '',
  last_name: '',
  last_login: new Date('2022-02-22T10:18:58.560468Z'),
  profile: {
    alias: '',
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
