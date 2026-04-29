import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const createSocket = () =>
  io(socketUrl, {
    transports: ['websocket'],
    autoConnect: true
  });
