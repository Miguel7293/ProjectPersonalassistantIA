import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';

const router = Router();

// Ruta para interactuar con la API de Gemini
router.post('/message', ChatController.sendMessage);

export default router;
