import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();

// Ruta para registro de usuario
router.post('/register', UserController.register);

// Ruta para login de usuario
router.post('/login', UserController.login);

export default router;
