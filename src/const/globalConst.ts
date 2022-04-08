const API_URL = `${process.env.API_URL}/en/api`;
export const CURRENT_USER_API = `${API_URL}/registration/user/@me/`;
export const SESSION_API = `${API_URL}/roleplay/session`;
export const CHAT_API = `${API_URL}/chat/chat`;

const WS_URL = `${process.env.WS_URL}`;
export const CHAT_WEBSOCKET = `${WS_URL}/ws/chat/`;
// WebSocket functions
export const WS_TYPES = {
  SETUP_CHANNEL: 'setup_channel_layer',
  SEND_MESSAGE: 'send_message',
  MAKE_ROLL: 'make_roll',
};

export const BOT_COMMAND_PREFIX = process.env.BOT_COMMAND_PREFIX;
