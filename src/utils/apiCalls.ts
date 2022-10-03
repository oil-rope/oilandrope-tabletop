import {
  BOT_API,
  CAMPAIGN_API,
  CHAT_API,
  CURRENT_USER_API,
  TOKEN_API,
} from '@Constants';
import {
  IAuthTokenRequest,
  IAuthTokenResponse,
  IBot,
  ICampaign,
  IPaginatedChatMessageList,
  IUser,
} from '@Interfaces';

export const COMMON_HEADERS = new Headers({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

/**
 * Since there's a lot of logic that will be used all the time the correct
 * thing to do it's to wrap it all on a single method.
 *
 * @param {string} url The URL from which retrieve data.
 * @param {string} errorMsg Error message to launch if response wasn't okay.
 * @returns {Promise<T>} The JSON response.
 */
export const fetchData = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  errorMsg = "Couldn't retrieve data.",
  // eslint-disable-next-line no-undef
  extra: RequestInit = {},
): Promise<T> => {
  // eslint-disable-next-line no-undef
  const init: RequestInit = {
    method: method,
    mode: 'cors',
    credentials: 'include',
    headers: COMMON_HEADERS,
  };
  const res = await fetch(url, { ...init, ...extra });
  if (res.ok) return await res.json();
  throw new Error(errorMsg);
};

/**
 * Wrapper with get of `fetchData`.
 *
 * @param {string} url The URL from which retrieve data.
 * @param {string} errorMsg Error message in case response is not okay.
 * @returns {Promise<T>} The JSON response.
 */
export const getData = async <T>(
  url: string,
  errorMsg = "Couldn't retrieve data.",
): Promise<T> => {
  return fetchData(url, 'GET', errorMsg);
};

/**
 * Wrapper with get of `fetchData`.
 *
 * @param {string} url The URL from which retrieve data.
 * @param {object} data Data for POST request.
 * @param {string} errorMsg Error message in case response is not okay.
 * @returns {Promise<T>} The JSON response.
 */
export const postData = async <T>(
  url: string,
  data: object,
  errorMsg = "Couldn't post data.",
): Promise<T> => {
  return fetchData(url, 'POST', errorMsg, { body: JSON.stringify(data) });
};

/**
 * Calls User API with current cookies in order to access logged user data.
 *
 * @returns {Promise<IUser>} Promise with given result.
 */
export const loadUser = (): Promise<IUser> => {
  return getData<IUser>(
    CURRENT_USER_API,
    "We couldn't authenticate you user. Have you login on Oil & Rope?",
  );
};

/**
 * With given username and password you can login on Oil & Rope and
 * retrieve a unique token. This token can be passed through headers as "Authorization: Token <token>".
 *
 * @param {string} username User to login.
 * @param {string} password Password to login.
 * @returns {Promise<IAuthTokenResponse>} Promise with given result.
 */
export const getToken = (
  username: string,
  password: string,
): Promise<IAuthTokenResponse> => {
  const request: IAuthTokenRequest = { username, password };
  return postData<IAuthTokenResponse>(
    TOKEN_API,
    request,
    'Credentials are incorrect.',
  );
};

/**
 * Calls Bot API to retrieve Oil & Rope bot.
 *
 * @returns {Promise<IBot>} Promise with given result.
 */
export const loadBot = (): Promise<IBot> => {
  return getData<IBot>(
    BOT_API,
    "We couldn't retrieve bot data. Have you login on Oil & Rope?",
  );
};

/**
 * Calls Session API and returns given object.
 *
 * @param {number} id Session ID.
 * @param {Function} callbackFn Function to call when JSON data is returned.
 * @returns {Promise<ICampaign>} Promise with given result.
 */
export const loadCampaign = (id: number): Promise<ICampaign> => {
  return getData<ICampaign>(
    `${CAMPAIGN_API}/${id}/`,
    "We could't retrieve data from your session. Are you sure this is the correct URL?",
  );
};

/**
 * Calls Session API and returns given object.
 *
 * @param {number} id Chat ID.
 * @returns {Promise<IPaginatedChatMessageList>} Promise with given result.
 */
export const loadChatMessages = (
  id: number,
): Promise<IPaginatedChatMessageList> => {
  return getData<IPaginatedChatMessageList>(
    `${CHAT_API}/${id}/messages/`,
    "We couldn't get the chat.",
  );
};
