'use client';

import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Badge, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../../../utils/api'; // Tu instancia de axios o API

// Definir el tipo de la notificación
interface Notification {
  notification_id: number;
  unique_code: string;
  type: string;
  content: string;
  creation_date: string;
  read: boolean;
}

// Definir el tipo de userData
interface GetData {
  userData: {
    unique_code: string | null;
    id: string | null;
  };
}

const ShedulesSection = ({ userData }: { userData: GetData['userData'] | null }) => {
  // Verifica si userData existe antes de proceder
  if (!userData) {
    console.log('User not authenticated');  // Depuración para saber que no hay userData
    return <Typography color="error">User not authenticated</Typography>; // Si no hay userData, no renderizamos nada
  }

  // Si userData está disponible, guardamos los datos en localStorage
  if (userData.id) {
    console.log('Storing in localStorage: userId:', userData.id, 'uniqueCode:', userData.unique_code);  // Depuración
    localStorage.setItem('userId', userData.id.toString());
    localStorage.setItem('uniqueCode', userData.unique_code || '');  // Aseguramos que no sea null o undefined
  }

  const [notificationsData, setNotificationsData] = useState<Notification[]>([]); // Inicializamos con el tipo Notification[]
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userData?.unique_code) {
        try {
          // Hacemos la solicitud usando el unique_code del usuario
          const response = await api.get(`/api/v1/notification/${userData.unique_code}`);

          if (response.data.ok) {
            // Si la respuesta es exitosa, se actualizan las notificaciones
            setNotificationsData(response.data.notifications);
          } else {
            setMessage('No notifications found or error fetching notifications.');
          }
        } catch (error) {
          console.error(error);
          setMessage('Error fetching notifications.');
        }
      } else {
        setMessage('User not authenticated.');
      }
    };

    fetchNotifications();
  }, [userData]); // Solo se ejecuta cuando userData cambia o se monta el componente

  const handleNotificationClick = async (id: number) => {
    try {
      // Realizar la solicitud a la API para marcar la notificación como leída
      const response = await api.put(`/api/v1/notification/readed/${id}`);

      if (response.data.ok) {
        // Si la API devuelve éxito, actualizamos el estado local para reflejar la notificación leída
        setNotificationsData((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.notification_id === id ? { ...notification, read: true } : notification
          )
        );
      } else {
        console.error('Failed to update notification to read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notifications
      </Typography>
      {message && <Typography color="error">{message}</Typography>} {/* Mostrar mensajes de error o éxito */}
      <List>
        {notificationsData.map((notification) => (
          <ListItem key={notification.notification_id}>
            <ListItemButton
              onClick={() => handleNotificationClick(notification.notification_id)} // Al hacer clic, marcamos como leída
              sx={{
                backgroundColor: notification.read ? 'transparent' : '#545454',
                borderRadius: '8px',
                padding: '8px 16px',
              }}
            >
              <Badge
                color="primary"
                variant="dot"
                invisible={notification.read}
              >
                <Avatar sx={{ marginRight: 2 }}>N</Avatar>
              </Badge>
              <ListItemText
                primary={notification.type} // Mostramos el tipo de notificación
                secondary={
                  <>
                    {/* Asegurándonos de no usar <p> */}
                    <Typography variant="body2" component="span">
                      {notification.content}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="span">
                      {new Date(notification.creation_date).toLocaleString()} {/* Fecha de la notificación */}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ShedulesSection;
