import { IChatMessage } from '@Interfaces';

/**
 * This interface represents a roll object.
 */
export type IRoll = Record<string, number[]>;

/**
 * This interface allows us to handle WebSocket messages **just** for the chat.
 * It is not a generic interface for the whole application.
 */
export interface IWebSocketMessage {
  type: string;
  content: IChatMessage;
  chat?: number;
  roll?: IRoll;
}
