import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes.js';
import playerRoutes from './routes/playerRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/games', gameRoutes);
app.use('/api/players', playerRoutes);

export default app;