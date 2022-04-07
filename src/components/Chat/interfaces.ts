import { IMessage } from '@Interfaces';

/**
 * This interface allows us to handle WebSocket messages **just** for the chat.
 * It is not a generic interface for the whole application.
 */
export interface IWebSocketMessage {
  type: string;
  content: IMessage;
  chat?: number;
  roll?: Record<string, number[]>;
}
