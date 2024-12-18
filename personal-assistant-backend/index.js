import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // Asegúrate de importar CORS
import { connectDB } from './database/connection.database.js';
import userRouter from './routes/user.route.js';
import taskRouter from './routes/task.route.js';
import projectRouter from './routes/project.route.js';
import chatRouter from './routes/chat.route.js';
import { UserController } from './controllers/user.controller.js';
import notificationRouter from './routes/notification.route.js'


const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Permitir solicitudes desde el frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Incluir Authorization
};


// Usamos CORS en todas las rutas
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Manejar preflight requests

app.use(express.json()); // Habilitamos para recibir JSON
app.use(express.urlencoded({ extended: true })); // Habilitamos para recibir datos URL-encoded

connectDB(); // Establecemos la conexión con la base de datos

// Rutas
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/task', taskRouter);
app.use('/api/v1/users', userRouter);  // Ruta para el login y registro
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/notification', notificationRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
