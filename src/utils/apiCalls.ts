import { BOT_API, CHAT_API, CURRENT_USER_API, SESSION_API } from '@Constants';
import { IBot, IChat, ISession, IUser } from '@Interfaces';

/**
 * Since there's a lot of logic that will be used all the time the correct
 * thing to do it's to wrap it all on a single method.
 *
 * @param url The URL from which retrieve data.
 * @param errorMsg Error message to launch if response wasn't 200.
 * @returns {Promise<T>} The JSON response.
 */
export const loadData = async <T>(
  url: string,
  errorMsg = "Couldn't retrieve data.",
): Promise<T> => {
  const res = await fetch(url, { mode: 'cors', credentials: 'include' });
  if (res.ok) return await res.json();
  throw new Error(errorMsg);
};

/**
 * Calls User API with current cookies in order to access logged user data.
 *
 * @returns {Promise<IUser>} Promise with given result.
 */
export const loadUser = (): Promise<IUser> => {
  return loadData<IUser>(
    CURRENT_USER_API,
    "We couldn't authenticate you user. Have you login on Oil & Rope?",
  );
};

/**
 * Calls Bot API to retrieve Oil & Rope bot.
 *
 * @returns {Promise<IBot>} Promise with given result.
 */
export const loadBot = (): Promise<IBot> => {
  return loadData<IBot>(
    BOT_API,
    "We couldn't retrieve bot data. Have you login on Oil & Rope?",
  );
};

/**
 * Calls Session API and returns given object.
 *
 * @param {number} id Session ID.
 * @param {Function} callbackFn Function to call when JSON data is returned.
 * @returns {Promise<ISession>} Promise with given result.
 */
export const loadSession = (id: number): Promise<ISession> => {
  return loadData<ISession>(
    `${SESSION_API}/${id}/`,
    "We could't retrieve data from your session. Are you sure this is the correct URL?",
  );
};

/**
 * Calls Session API and returns given object.
 *
 * @param {number} id Chat ID.
 * @returns {Promise<IChat>} Promise with given result.
 */
export const loadChat = (id: number): Promise<IChat> => {
  return loadData<IChat>(
    `${CHAT_API}/${id}/nested/`,
    "We couldn't get the chat.",
  );
};
