import WaitingRoom from '../models/waitingRoom.js';

export const getAllWaitingRooms = async (req, res) => {
  try {
    const rooms = await WaitingRoom.findAll();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener salas de espera', error });
  }
};

export const getWaitingRoomById = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await WaitingRoom.findByPk(id);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: 'Sala de espera no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sala de espera', error });
  }
};