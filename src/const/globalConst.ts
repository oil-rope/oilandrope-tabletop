const API_URL = '/oarapi';
let WS_URL = process.env.WS_URL;

if (!WS_URL) {
  WS_URL = 'ws://127.0.0.1:8000/ws';
}

export const CURRENT_USER_API = `${API_URL}/registration/user/`;
export const BOT_API = `${API_URL}/registration/bot/`;
export const TOKEN_API = `${API_URL}/auth/token/`;
export const CAMPAIGN_API = `${API_URL}/roleplay/campaign`;
export const CHAT_API = `${API_URL}/chat`;

export const CHAT_WEBSOCKET = `${WS_URL}/chat/`;
// WebSocket functions
export const WS_TYPES = {
  SETUP_CHANNEL: 'setup_channel_layer',
  SEND_MESSAGE: 'send_message',
  MAKE_ROLL: 'make_roll',
} as const;
