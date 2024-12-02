import jwt from 'jsonwebtoken';
import Game from '../models/game.js';
import Player from '../models/player.js';

class PlayerController {
  async joinRoom(socket, { roomID, token }) {
    try {
      if (!token) {
        socket.emit('error', { message: 'Token no proporcionado' });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      const game = await Game.findOne({ where: { id: roomID, status: 'waiting' } });
      if (!game) {
        socket.emit('error', { message: 'Juego no encontrado o no está en estado de espera' });
        return;
      }

      const existingPlayer = await Player.findOne({ where: { game_id: roomID, user_id } });
      if (existingPlayer) {
        socket.emit('updatePlayers', { roomID: game.game_id, active_players: game.active_players });
        socket.emit('error', { message: 'El jugador ya está en el juego' });
        return;
      }

      const player = await Player.create({ game_id: roomID, user_id });
      game.active_players += 1;
      await game.save();

      socket.join(roomID);
      io.to(roomID).emit('updatePlayers', { roomID: game.game_id, active_players: game.active_players });
    } catch (error) {
      console.error('Error al unirse al juego:', error);
      socket.emit('error', { message: 'Error al unirse al juego', error });
    }
  }

}

export default new PlayerController();