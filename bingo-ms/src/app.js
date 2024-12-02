import express from 'express';
import cors from 'cors';
import waitingRoomRoutes from './routes/waitingRoomRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/waiting-rooms', waitingRoomRoutes);

export default app;