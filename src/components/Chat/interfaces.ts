import { IChatMessage } from '@Interfaces';

/**
 * This interface represents a roll object.
 */
export type IRoll = Record<string, number[]>;

/**
 * This interface allows us to handle WebSocket messages **just** for the chat.
 * It is not a generic interface for the whole application.
 */
export interface IWSReceiveChatMessage {
  type: string;
  content: IChatMessage;
  chat?: number;
  roll?: IRoll;
}

/**
 * This interface represents a message **sent** from the ChatInput but no the received item.
 */
export interface IWSSendChatMessage {
  type: string;
  message: string;
  chat: number;
}
