import { faker } from '@faker-js/faker';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import {
  getData,
  getToken,
  loadBot,
  loadCampaign,
  loadChatMessages,
  loadUser,
} from '@Utils/apiCalls';
import { IAuthTokenResponse } from '@Interfaces';

beforeAll(() => {
  enableFetchMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('loadData suite', () => {
  it('calls API with default error', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    await expect(getData(faker.internet.url())).rejects.toThrowError();
  });
});

describe('loadUser suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    loadUser();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('calls API but fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    expect(loadUser()).rejects.toThrowError(
      "We couldn't authenticate you user. Have you login on Oil & Rope?",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('loadBot suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    loadBot();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('calls API but fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    expect(loadBot()).rejects.toThrowError(
      "We couldn't retrieve bot data. Have you login on Oil & Rope?",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('loadCampaign suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    loadCampaign(1);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('calls API but fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    expect(loadCampaign(1)).rejects.toThrowError(
      "We could't retrieve data from your session. Are you sure this is the correct URL?",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('loadChatMessages suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    loadChatMessages(1);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('calls API but fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    expect(loadChatMessages(1)).rejects.toThrowError(
      'Error when loading messages',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('getToken suite', () => {
  it('calls API correctly', async () => {
    const response: IAuthTokenResponse = {
      token: faker.internet.password(),
    };
    fetchMock.mockResponseOnce(JSON.stringify(response));

    const token = await getToken(
      faker.internet.userName(),
      faker.internet.password(),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(token.token).toEqual(response.token);
  });

  it('calls API but fails', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    await expect(
      getToken(faker.internet.userName(), faker.internet.password()),
    ).rejects.toThrowError('Credentials are incorrect.');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
