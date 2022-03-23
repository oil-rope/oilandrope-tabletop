import { CHAT_API, CURRENT_USER_API, SESSION_API } from '@Constants';
import { IChat, ISession, IUser } from '@Interfaces';

/**
 * Calls User API with current cookies in order to access logged user data.
 *
 * @param {Function} callbackFn Function to call when JSON data is returned.
 */
export const loadUser = (callbackFn: (data: IUser) => void) =>
  fetch(CURRENT_USER_API, { mode: 'cors', credentials: 'include' })
    .then((res) => {
      if (res.ok) return res.json();
      return Error(
        "We couldn't authenticate you user. Have you login on Oil & Rope?",
      );
    })
    .then((data) => {
      callbackFn(data);
    });

/**
 * Calls Session API and returns given object.
 *
 * @param {number} id Session ID.
 * @param {Function} callbackFn Function to call when JSON data is returned.
 */
export const loadSession = (
  id: number,
  callbackFn: (data: ISession) => void,
) => {
  fetch(`${SESSION_API}/${id}/`, { mode: 'cors', credentials: 'include' })
    .then((res) => {
      if (res.ok) return res.json();
      return Error(
        "We could't retrieve data from your session. Are you sure this is the correct URL?",
      );
    })
    .then((data) => {
      callbackFn(data);
    });
};

/**
 * Calls Session API and returns given object.
 *
 * @param {number} id Chat ID.
 * @param {Function} callbackFn Function to call when JSON data is returned.
 */
export const loadChat = (id: number, callbackFn: (data: IChat) => void) => {
  fetch(`${CHAT_API}/${id}/nested/`, { mode: 'cors', credentials: 'include' })
    .then((res) => {
      if (res.ok) return res.json();
      return Error("We couldn't get the chat.");
    })
    .then((data) => {
      callbackFn(data);
    });
};
