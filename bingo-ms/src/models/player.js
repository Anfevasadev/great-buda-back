import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Game from './game.js';

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  game_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Game,
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  bingo_called: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_winner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_disqualified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'players',
});

try {
  await sequelize.sync();
  console.log('Modelo de jugador sincronizado con la base de datos.');
} catch (error) {
  console.error('Error al sincronizar el modelo:', error);
}

export default Player;