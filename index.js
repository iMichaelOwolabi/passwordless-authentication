import express from 'express';
import { config } from 'dotenv';
import { authRouter } from './src/routes/authRouter.js';

config();

const app = express();

app.use(express.json());
const port = process.env.PORT ?? 3000;

app.use('/api/v1/auth', authRouter);

app.get('/api/v1', (req, res) => {
  res.send('Passwordless authentication powered by Redis');
});

app.listen(port, () => {
  console.log(`Server running on: http://localhost:${port}`);
});
