import express from 'express';  
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';


const app = express();

app.use(bodyParser.json());
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('¡Servidor Express está corriendo!');
});

export default app; 
