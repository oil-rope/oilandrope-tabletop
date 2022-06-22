const API_URL = `${process.env.API_URL}/api`;
export const CURRENT_USER_API = `${API_URL}/registration/user/`;
export const BOT_API = `${API_URL}/registration/bot/`;
export const TOKEN_API = `${API_URL}/auth/token/`;
export const CAMPAIGN_API = `${API_URL}/roleplay/campaign`;
export const CHAT_API = `${API_URL}/chat`;

const WS_URL = `${process.env.WS_URL}`;
export const CHAT_WEBSOCKET = `${WS_URL}/ws/chat/`;
// WebSocket functions
export const WS_TYPES = {
  SETUP_CHANNEL: 'setup_channel_layer',
  SEND_MESSAGE: 'send_message',
  MAKE_ROLL: 'make_roll',
};
