import 'dotenv/config'
import express from 'express';
import { connectDB } from './database/connection.database.js';
import userRouter from './routes/user.route.js';

const app = express();

app.use(express.json()); //habilitamos
app.use(express.urlencoded({ extended: true })); //habilitamos

connectDB();

app.use('/api/v1/users', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
