// notification.controller.js
import { NotificationModel } from '../models/notification.model.js';

const getNotifications = async (req, res) => {
    try {
        const { unique_code } = req.params;

        // Verificar que se haya pasado un unique_code
        if (!unique_code) {
            return res.status(400).json({
                ok: false,
                msg: 'Missing unique_code'
            });
        }

        // Obtener las notificaciones del usuario
        const notifications = await NotificationModel.getNotificationsByUniqueCode(unique_code);

        if (notifications.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No notifications found for this user'
            });
        }

        // Devolver las notificaciones encontradas
        return res.status(200).json({
            ok: true,
            notifications
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'An error occurred while fetching notifications'
        });
    }
};

// Función para marcar una notificación como leída
const markNotificationAsRead = async (req, res) => {
    try {
        const { notification_id } = req.params;

        // Verificar si el notification_id fue pasado
        if (!notification_id) {
            return res.status(400).json({ ok: false, msg: 'Missing notification_id' });
        }

        // Llamar al modelo para marcar la notificación como leída
        const updated = await NotificationModel.markAsRead(notification_id);

        if (updated) {
            return res.status(200).json({ ok: true });
        } else {
            return res.status(404).json({ ok: false, msg: 'Notification not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error marking notification as read' });
    }
};

export const NotificationController = {
    getNotifications,
    markNotificationAsRead
};
