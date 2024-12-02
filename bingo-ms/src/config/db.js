import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

try {
  await sequelize.authenticate();
  console.log('Conexión a la base de datos establecida correctamente.');
} catch (error) {
  console.error('No se pudo conectar a la base de datos:', error);
}

export default sequelize;