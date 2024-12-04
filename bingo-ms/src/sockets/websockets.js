import { Server } from 'socket.io';
import playerController from '../controllers/playerController.js';
import { handleBingoEvent } from '../controllers/gameController.js';

let io;

function setupWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    socket.on('joinRoom', (data) => playerController.joinRoom(socket, data));

    socket.on('playerLeft', (data) => playerController.playerLeft (socket, data));

    socket.on('bingo', (data) => handleBingoEvent(socket, data));
  });

  return io;
}
function sendEventToAll(event, data) {
  io.emit(event, data);
}

export { io, sendEventToAll };
export default setupWebSocket;