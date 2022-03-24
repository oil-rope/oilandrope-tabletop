import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { loadUser, loadSession, loadChat, loadData } from '@Utils/apiCalls';
import faker from '@faker-js/faker';

beforeAll(() => {
  enableFetchMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('loadData suite', () => {
  it('calls API with default error', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    await expect(loadData(faker.internet.url())).rejects.toThrowError();
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

describe('loadSession suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    loadSession(1);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('calls API but fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    expect(loadSession(1)).rejects.toThrowError(
      "We could't retrieve data from your session. Are you sure this is the correct URL?",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('loadChat suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    loadChat(1);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('calls API but fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

    expect(loadChat(1)).rejects.toThrowError("We couldn't get the chat.");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
