import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Player from './player.js';

const BingoCard = sequelize.define('BingoCard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  player_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Player,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  numbers: {
    type: DataTypes.JSONB,
    allowNull: false
  }
});

try {
    await sequelize.sync();
    console.log('Modelo de bingoCard sincronizado con la base de datos.');
  } catch (error) {
    console.error('Error al sincronizar el modelo:', error);
  }

export default BingoCard;