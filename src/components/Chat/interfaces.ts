import { IChatMessage } from '@Interfaces';
import { WS_TYPES } from '@Constants';

/**
 * This interface represents a roll object.
 */
export type IRoll = Record<string, number[]>;

/**
 * Allowed type of messages to be received from WebSocket.
 */
type WebSocketTypes = keyof typeof WS_TYPES;

/**
 * This interface allows us to handle WebSocket messages **just** for the chat.
 * It is not a generic interface for the whole application.
 */
export interface IWSReceiveChatMessage {
  type: WebSocketTypes;
  content: IChatMessage;
  chat?: number;
  roll?: IRoll;
}

/**
 * This interface represents a message **sent** from the ChatInput but no the received item.
 */
export interface IWSSendChatMessage {
  type: WebSocketTypes;
  message: string;
  chat: number;
}
