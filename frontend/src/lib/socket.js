import { io } from 'socket.io-client';
import { apiBaseUrl } from './api';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(apiBaseUrl, { autoConnect: false });
  }

  return socket;
}
