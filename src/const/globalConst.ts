const API_URL = `${process.env.API_URL}/en/api`;
export const CURRENT_USER_API = `${API_URL}/registration/user/@me/`;
export const SESSION_API = `${API_URL}/roleplay/session`;

const WS_URL = `${process.env.WS_URL}`;
export const CHAT_WEBSOCKET = `${WS_URL}/ws/chat/`;
// WebSocket functions
export const WS_TYPES = {
  SETUP_CHANNEL: 'setup_channel',
  SEND_MESSAGE: 'send_message',
};
