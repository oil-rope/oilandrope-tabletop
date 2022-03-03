import { CURRENT_USER_API } from '@Constants';
import { IUser } from '@Contexts';

/**
 * Calls User API with current cookies in order to access logged user data.
 *
 * @param {Function} callbackFn Function to call when JSON data is returned.
 */
export const loadUser = (callbackFn: (data: IUser) => void) => {
  fetch(CURRENT_USER_API, {
    mode: 'cors',
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      callbackFn(data);
    });
};
