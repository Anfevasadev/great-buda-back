import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Game from './game.js';

const Ballot = sequelize.define('Ballot', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    game_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Game,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 75
        }
    },
    sequence: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    extracted_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'ballots'
});

try {
    await sequelize.sync();
    console.log('Modelo de balotas sincronizado con la base de datos.');
} catch (error) {
    console.error('Error al sincronizar el modelo:', error);
}
export default Ballot;