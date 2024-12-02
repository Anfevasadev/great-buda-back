import Game from '../models/game.js';

export const createOrGetActiveGame = async (req, res) => {
  try {
    let game = await Game.findOne({ where: { status: 'waiting' } });

    if (!game) {
      game = await Game.create({ status: 'waiting' });
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener o crear juego', error });
  }
};

export const deleteAllGames = async (req, res) => {
  try {
    await Game.destroy({ where: {}, truncate: true });
    res.status(200).json({ message: 'Todas las salas han sido eliminadas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar las salas', error });
  }
};