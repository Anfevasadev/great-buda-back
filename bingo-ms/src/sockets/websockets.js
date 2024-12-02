import { Server } from 'socket.io';
import playerController from '../controllers/playerController.js';

let io;

function setupWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Manejador para el evento 'joinRoom'
    socket.on('joinRoom', (data) => playerController.joinRoom(socket, data));

    // Agregar más manejadores de eventos aquí
  });

  return io;
}

export { io };
export default setupWebSocket;