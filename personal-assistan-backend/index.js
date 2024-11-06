import 'dotenv/config'
import express from 'express';
import { connectDB } from './database/connection.database.js';


const app = express();

//connectDB();

app.get('/', (req, res) => {
    res.send('Hello darling!');}
)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
