// notification.routes.js
import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js';

const router = Router();

// Ruta para obtener las notificaciones de un usuario por su unique_code
router.get('/:unique_code', NotificationController.getNotifications);
router.put('/readed/:notification_id', NotificationController.markNotificationAsRead);

export default router;
