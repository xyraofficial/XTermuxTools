import express from 'express';
import cors from 'cors';
import authRouter from './auth';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRouter);

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
