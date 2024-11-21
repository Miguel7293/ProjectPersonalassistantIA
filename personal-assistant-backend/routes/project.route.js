import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';

const router = Router();

// Ruta para operaciones SQL en la tabla PROJECT
router.post('/operation', ProjectController.performOperation);

export default router;
