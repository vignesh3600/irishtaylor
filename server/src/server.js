import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { setSocketServer } from './config/socket.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.allowedOrigins,
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('admin:join', () => socket.join('admins'));
});

setSocketServer(io);

connectDb()
  .then(() => {
    server.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
