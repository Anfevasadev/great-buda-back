import Player from '../models/player.js';
import Game from '../models/game.js';

export const joinGame = async (req, res) => {
  const { game_id } = req.body;
  const user_id = req.user.id;

  if (!game_id) {
    return res.status(400).json({ message: 'game_id es requerido' });
  }

  if (!user_id) {
    return res.status(400).json({ message: 'user_id es requerido' });
  }

  try {
    const game = await Game.findOne({ where: { id: game_id, status: 'waiting' } });
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado o no está en estado de espera' });
    }

    const existingPlayer = await Player.findOne({ where: { game_id, user_id } });
    if (existingPlayer) {
      return res.status(400).json({ message: 'El jugador ya está en el juego' });
    }

    const player = await Player.create({ game_id, user_id });
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ message: 'Error al unirse al juego', error });
  }
};