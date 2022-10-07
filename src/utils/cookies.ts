import Cookies from 'js-cookie';

/**
 * Gets current date and sets 7 seven forward.
 *
 * @returns {Date} Next week date.
 */
export const getDefaultExpirationDate = (): Date => {
  const today = new Date();
  const nextWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDay() + 7,
  );
  return nextWeek;
};

export { Cookies };
