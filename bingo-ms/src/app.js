import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import { createServer } from 'http';
import setupWebSocket from './sockets/websockets.js';

const app = express();
const server = createServer(app);

setupWebSocket(server);

app.use(cors());
app.use(express.json());
app.use('/api/games', gameRoutes);
app.use('/api/players', playerRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});



export { app, server };