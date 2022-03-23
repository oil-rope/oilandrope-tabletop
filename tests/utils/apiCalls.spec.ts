import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { loadUser, loadSession, loadChat } from '@Utils/apiCalls';

beforeAll(() => {
  enableFetchMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('loadUser suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const callbackFn = jest.fn();

    loadUser(callbackFn);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('calls API but fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });
    const callbackFn = jest.fn();

    loadUser(callbackFn);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('loadSession suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const callbackFn = jest.fn();

    loadSession(1, callbackFn);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('calls API but fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });
    const callbackFn = jest.fn();

    loadSession(1, callbackFn);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('loadChat suite', () => {
  it('calls API correctly', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const callbackFn = jest.fn();

    loadChat(1, callbackFn);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('calls API but fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });
    const callbackFn = jest.fn();

    loadChat(1, callbackFn);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
