import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';

const router = Router();

// Ruta para operaciones SQL en la tabla TASK
router.post('/task/operation', TaskController.performOperation);

export default router;
