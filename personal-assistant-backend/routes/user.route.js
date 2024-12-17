import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js';

const router = Router();

// Ruta para registro de usuario
router.post('/register', UserController.register);

// Ruta para login de usuario
router.post('/login', UserController.login);

// Ruta para mostrar información del Dashboard
router.get('/getDashboardProfile', verifyToken, UserController.profileDashBoard);

// Ruta para actualizar el perfil del usuario
router.put('/updateProfile', verifyToken, UserController.updateProfile);

export default router;
