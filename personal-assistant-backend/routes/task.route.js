import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';

const router = Router();

// Ruta para operaciones SQL en la tabla TASK
router.post('/task/operation', TaskController.performOperation);
router.get('/tasks/:taskId/collaborators', TaskController.getCollaboratorsByTaskId);  // Usar 'GET' y la ruta correcta
router.delete('/tasks/:taskId/collaborators/:userId', TaskController.removeCollaboratorFromTask);  // Usar 'DELETE' para eliminar
router.post('/tasks/:taskId/collaborators/:userId', TaskController.addCollaboratorToTask);  // Usar 'POST' para agregar
router.post('/tasks/advance', TaskController.advanceTask);

export default router;
