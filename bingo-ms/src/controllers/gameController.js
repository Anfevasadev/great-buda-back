import Game from '../models/game.js';
import Player from '../models/player.js';
import { io } from '../sockets/websockets.js'; 

const MIN_WAIT_TIME = 5; // Tiempo mínimo de espera en segundos
const MAX_WAIT_TIME = 20; // Tiempo máximo de espera en segundos

export const createOrGetActiveGame = async (req, res) => {
  try {
    let game = await Game.findOne({ where: { status: 'waiting' } });

    if (!game) {
      game = await Game.create({ status: 'waiting', active_players: 0 });

      let elapsedTime = 0;
      const interval = setInterval(async () => {
        elapsedTime += 1;

        const activePlayers = await Player.count({ where: { game_id: game.id } });
        game.active_players = activePlayers;
        await game.save();

        io.to(game.id).emit('waitingTime', { waitingTime: elapsedTime, roomID: game.id, activePlayers: game.active_players });
        io.to(game.id).emit('updatePlayers', { roomID: game.id, activePlayers: game.active_players });

        // Verificar si se ha alcanzado el tiempo máximo de espera
        if (elapsedTime >= MAX_WAIT_TIME) {
          clearInterval(interval);
          if (game.active_players < 2) {
            game.status = 'finished';
            await game.save();
            io.to(game.id).emit('closeRoom', { message: 'La sala se ha cerrado por falta de jugadores', roomID: game.id });
            await Game.destroy({ where: { id: game.id } }); // Eliminar la sala de la base de datos
          } else {
            io.to(game.id).emit('startGame', { message: 'El juego va a comenzar', roomID: game.id });
          }
        }
      }, 1000);

      // Esperar mínimo 30 segundos antes de permitir que el juego comience
      setTimeout(async () => {
        if (elapsedTime >= MIN_WAIT_TIME && game.active_players >= 2) {
          io.to(game.id).emit('startGame', { message: 'El juego va a comenzar', roomID: game.id });
          clearInterval(interval);
        }
      }, MIN_WAIT_TIME * 1000);
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener o crear juego', error });
  }
};

export const deleteAllGames = async (req, res) => {
  try {
    await Player.destroy({ where: {} });
    await Game.destroy({ where: {} });
    res.status(200).json({ message: 'Todos los juegos y jugadores han sido eliminados' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar los juegos y jugadores', error });
  }
};