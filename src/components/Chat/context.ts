import { createContext } from 'react';

import { MESSAGE_COLORS } from './const';

type BOOTSTRAP_COLORS_TYPE = typeof MESSAGE_COLORS[number];
export type ColorMapTypes = Record<number, BOOTSTRAP_COLORS_TYPE>;
interface IChatContext {
  colorMap: ColorMapTypes;
}

/**
 * This context is intended to store all user's colors for chat.
 * This color should be retrieved from Bootstrap colors.
 */
export const ChatContext = createContext<IChatContext>({} as IChatContext);
