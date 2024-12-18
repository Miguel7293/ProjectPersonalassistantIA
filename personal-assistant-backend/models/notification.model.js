// notification.model.js
import { db } from '../database/connection.database.js';

const getNotificationsByUniqueCode = async (unique_code) => {
    const query = {
        text: `SELECT * FROM notification WHERE unique_code = $1 ORDER BY creation_date DESC`,
        values: [unique_code]
    };
    const { rows } = await db.query(query);
    return rows;
};

const markAsRead = async (notification_id) => {
    const query = {
        text: `UPDATE notification SET read = TRUE WHERE notification_id = $1`,
        values: [notification_id]
    };

    const { rowCount } = await db.query(query);

    // Si la fila se actualizó, devolver true
    return rowCount > 0;
};

export const NotificationModel = {
    getNotificationsByUniqueCode,
    markAsRead
};
