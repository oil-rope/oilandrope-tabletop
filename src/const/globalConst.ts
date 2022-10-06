const LOCALHOST = window.location.host;
const SCHEMA = window.location.protocol;
const WEBSOCKET_SCHEMA = SCHEMA === 'https:' ? 'wss:' : 'ws:';

const API_URL = `${SCHEMA}//${LOCALHOST}/oarapi`;
const WS_URL = `${WEBSOCKET_SCHEMA}//${LOCALHOST}/oarws`;

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
  RECEIVE_MESSAGE: 'group_send_message',
} as const;
