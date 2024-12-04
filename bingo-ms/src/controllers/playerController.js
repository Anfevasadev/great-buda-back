import jwt from 'jsonwebtoken';
import Game from '../models/game.js';
import Player from '../models/player.js';
import BingoCard from '../models/bingoCard.js';
import { sendEventToAll } from '../sockets/websockets.js';
import { Op } from 'sequelize';
import { finishGame, stopSendingBallots } from './gameController.js';

class PlayerController {
  generateBingoCard() {
    const card = [];
    const columns = ['B', 'I', 'N', 'G', 'O'];
    const columnRanges = {
      B: [1, 15],
      I: [16, 30],
      N: [31, 45],
      G: [46, 60],
      O: [61, 75]
    };

    columns.forEach((column, index) => {
      const [min, max] = columnRanges[column];
      const numbers = [];
      while (numbers.length < 5) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      card.push(numbers);
    });

    card[2][2] = 'FREE';

    return card;
  }

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
      socket.emit('waitingTime', { waitingTime: 0, roomID: game.id, activePlayers: game.active_players });

      const existingPlayer = await Player.findOne({ where: { game_id: roomID, user_id } });
      if (existingPlayer) {
        const bingoCard = await BingoCard.findOne({ where: { player_id: existingPlayer.id } });
        socket.emit('updatePlayers', { roomID: game.id, activePlayers: game.active_players });
        socket.emit('bingoCard', { userId: player.user_id, bingoCard: bingoCard.numbers });
        socket.emit('error', { message: 'El jugador ya está en el juego' });
        return;
      }

      const player = await Player.create({ game_id: roomID, user_id });
      game.active_players += 1;
      await game.save();

      const bingoCard = this.generateBingoCard();
      await BingoCard.create({ player_id: player.id, numbers: bingoCard });
      socket.emit('bingoCard', { userId: player.user_id, bingoCard: bingoCard });

      socket.join(roomID);
      socket.to(roomID).emit('updatePlayers', { roomID: game.id, activePlayers: game.active_players });


    } catch (error) {
      console.error('Error al unirse al juego:', error);
      socket.emit('error', { message: 'Error al unirse al juego', error });
    }
  }

  async playerLeft(socket, { userId, gameId }) {

    try {
      if (!userId) {
        socket.emit('error', { message: 'User id no proporcionado' });
        return;
      }

      const player = await Player.findOne({ where: { game_id: gameId, user_id: userId } });
      if (!player) {
        socket.emit('error', { message: 'Jugador no encontrado en el juego' });
        return;
      }
      player.is_disqualified = true;
      await player.save();

      const game = await Game.findOne({ where: { id: gameId } });
      const playersInGame = await Player.count({ where: { game_id: gameId, is_disqualified: { [Op.not]: true } } });
      game.active_players = playersInGame;
      await game.save();

      sendEventToAll('updatePlayers', { roomID: game.id, active_players: game.active_players });

      if (game.active_players === 1) {
        const winner = await Player.findOne({ where: { game_id: gameId, user_id: { [Op.not]: userId } } });
        await finishGame(game, winner.user_id);
        sendEventToAll('gameFinished', { message: 'Los demás jugadores se retiraron', winner_id: winner.user_id });
      }

    } catch (error) {
      console.error('Error al salir del juego:', error);
      socket.emit('error', { message: 'Error al salir del juego', error });
    }
  }
}

export default new PlayerController();