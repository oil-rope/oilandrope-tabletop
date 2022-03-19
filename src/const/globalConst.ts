const API_URL = `${process.env.API_URL}/en/api`;
const WS_URL = `${process.env.WS_URL}`;
export const CURRENT_USER_API = `${API_URL}/registration/user/@me/`;
export const CHAT_WEBSOCKET = `${WS_URL}/ws/chat/`;

// WebSocket functions
export const CHAT_SEND_MESSAGE = 'send_message';
