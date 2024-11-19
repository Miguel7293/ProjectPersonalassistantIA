import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js';

const router = Router();

// Ruta para registro de usuario
router.post('/register', UserController.register);

// Ruta para login de usuario
router.post('/login', UserController.login);

// Ruta par mostrar informacion por el DashBoars
router.get('/getDashboardProfile', verifyToken, UserController.profileDashBoard);
export default router;
