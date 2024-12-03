import Ballot from '../models/ballot.js';
import Game from '../models/game.js';
import Player from '../models/player.js';
import { io } from '../sockets/websockets.js'; 

const MIN_WAIT_TIME = 5; // Tiempo mínimo de espera en segundos
const MAX_WAIT_TIME = 20; // Tiempo máximo de espera en segundos

const ballotIntervals = {};
const sentBallots = {};

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
            io.to(game.id).emit('closeRoom', { message: 'La sala se ha cerrado por falta de jugadores', roomID: game.id });
            await Player.destroy({ where: { game_id: game.id } }); // Eliminar los jugadores de la base de datos
            await Game.destroy({ where: { id: game.id } }); // Eliminar la sala de la base de datos
          } else {
            await startGame(game);
          }
        }
        if (elapsedTime >= MIN_WAIT_TIME && game.active_players >= 2) {
            await startGame(game);
            clearInterval(interval);
        }
      }, 1000);      
      
      
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener o crear juego', error });
  }
};

const startGame = async (game) => {
  try {
    game.status = 'in_progress';
    await game.save();
    io.to(game.id).emit('startGame', { message: 'El juego va a comenzar', roomID: game.id });

    sendBallots(game.id);
  } catch (error) {
    console.error('Error al iniciar el juego:', error);
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

const sendBallots = (gameID) => {
  let sequence = 1;
  sentBallots[gameID] = new Set(); // Inicializar el conjunto de balotas enviadas para el juego

  const interval = setInterval(async () => {
    if (sentBallots[gameID].size >= 75) {
      clearInterval(interval);
      return;
    }
    try {
      let number;
      do {
        number = Math.floor(Math.random() * 75) + 1; // Generar un número aleatorio entre 1 y 75
      } while (sentBallots[gameID].has(number)); // Repetir hasta obtener un número que no haya sido enviado

      sentBallots[gameID].add(number); // Agregar el número al conjunto de balotas enviadas

      const ballot = await Ballot.create({ game_id: gameID, number, sequence, extracted_at: new Date() });
      io.emit('newBallot', { number: ballot.number, sequence: ballot.sequence });

      sequence += 1;
    } catch (error) {
      console.error('Error al enviar ballot:', error);
      clearInterval(interval);
    }
  }, 5000); // Enviar un ballot cada 5 segundos

  ballotIntervals[gameID] = interval;
};

export const stopSendingBallots = (gameID) => {
  const interval = ballotIntervals[gameID];
  if (interval) {
    clearInterval(interval);
    delete ballotIntervals[gameID];
  }
};