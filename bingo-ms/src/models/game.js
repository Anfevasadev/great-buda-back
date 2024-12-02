import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['waiting', 'in_progress', 'finished']],
    },
  },
  winner_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ended_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

try {
  await sequelize.sync();
  console.log('Modelo de juego sincronizado con la base de datos.');
} catch (error) {
  console.error('Error al sincronizar el modelo:', error);
}

export default Game;