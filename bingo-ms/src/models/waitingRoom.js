import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const WaitingRoom = sequelize.define('WaitingRoom', {
  room_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

try {
  await sequelize.sync();
  console.log('Modelo de sala de espera sincronizado con la base de datos.');
} catch (error) {
  console.error('Error al sincronizar el modelo:', error);
}

export default WaitingRoom;