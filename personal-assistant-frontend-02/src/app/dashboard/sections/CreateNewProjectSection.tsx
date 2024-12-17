import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '../../../../utils/api'; // Tu instancia de axios o API
import { DateRange } from 'react-date-range'; // Importación de react-date-range
import { enGB } from 'date-fns/locale'; // Idioma en inglés (puedes cambiarlo a español)
import dayjs from 'dayjs';

import 'react-date-range/dist/styles.css'; // Estilos predeterminados
import 'react-date-range/dist/theme/default.css'; // Tema predeterminado

interface GetData {
  userData: {
    token: string | null;
    username: string | null;
    id: string | null;
  };
}

const CreateProject: React.FC<GetData> = ({ userData }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Start_Date: '',
    End_Date: '',
    Description: '',
  });

  const [message, setMessage] = useState('');
  const [dateRange, setDateRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }]);
  const [imageUrl, setImageUrl] = useState('');
  const [isImageValid, setIsImageValid] = useState(true);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar la URL de la imagen
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url && url !== "Predeterminado") {
      validateImageUrl(url); // Solo validamos la imagen si no es "Predeterminado"
    }
  };

  // Validación de URL de la imagen
  const validateImageUrl = async (url: string) => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const isValidExtension = validExtensions.some(ext => url.endsWith(ext));

    if (!isValidExtension) {
      setIsImageValid(false); // No es una imagen válida
      return;
    }

    // Verificar si la imagen es accesible a través de una solicitud HTTP
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        setIsImageValid(true); // Si la respuesta es ok, la imagen es válida
      } else {
        setIsImageValid(false); // Si no, la imagen no es válida
      }
    } catch (error) {
      setIsImageValid(false); // Si ocurre un error en la solicitud, consideramos que la imagen no es válida
    }
  };

  const handleSubmit = async () => {
    const { Name, Start_Date, End_Date, Description } = formData;
    if (!Start_Date || !End_Date || !Name) {
      setMessage('Name, Start Date, and End Date are required');
      return;
    }
  
    const requestPayload = {
      sqlQuery: 'INSERT',
      Name,
      Start_Date: dayjs(Start_Date).toISOString().split('T')[0],
      End_Date: dayjs(End_Date).toISOString().split('T')[0],
      Description,
    };
  
    try {
      const response = await api.post('/api/v1/project/operation', requestPayload);
  
      if (response.data.ok) {
        setMessage('Project created successfully!');
        const projectId = response.data.data.project_id;
  
        setFormData({ Name: '', Start_Date: '', End_Date: '', Description: '' });
  
        const userProjectPayload = {
          sqlQuery: 'INSERTRE',
          User_ID: userData.id,
          Project_ID: projectId,
        };
  
        const userProjectResponse = await api.post('/api/v1/project/operation', userProjectPayload);
  
        if (userProjectResponse.data.ok) {
          setMessage('User added to the project successfully!');
        } else {
          setMessage(`Error adding user to project: ${userProjectResponse.data.msg}`);
        }
        if (!userData?.id) {
          // Puedes agregar un manejo de error o redirigir al usuario si no tiene un ID válido
          console.log('User not authenticated');
          return;
        }
        // Guardar información en localStorage
        localStorage.setItem('projectId', projectId.toString());
        localStorage.setItem('userId', userData.id.toString());
  
        // Redirigir al entorno de tareas
        router.push('/EviromentTasks');
      } else {
        setMessage(`Error: ${response.data.msg || 'Failed to create project'}`);
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
      console.error(error);
    }
  };
  
  

  const handleDateChange = (ranges: any) => {
    const { selection } = ranges;
    setDateRange([selection]);

    const startDate = dayjs(selection.startDate).format('YYYY-MM-DD');
    const endDate = dayjs(selection.endDate).format('YYYY-MM-DD');

    setFormData({
      ...formData,
      Start_Date: startDate,
      End_Date: endDate,
    });
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: '#1f1f20BB',
        color: '#FFF',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}
    >
      {/* Caja general para los datos */}
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography variant="h6" mb={2}>
          Crear Proyecto
        </Typography>

        {/* Contenedor para las 2 columnas: izquierda con los campos y derecha con el calendario */}
        <Box display="flex" gap={3}>
          {/* Columna izquierda con los campos de texto */}
          <Box sx={{ width: '50%' }}>
            <TextField
              label="Nombre del Proyecto"
              fullWidth
              value={formData.Name}
              onChange={handleChange}
              name="Name"
              sx={{ marginBottom: 2 }}
            />

            <TextField
              label="Descripción del Proyecto"
              fullWidth
              value={formData.Description}
              onChange={handleChange}
              name="Description"
              sx={{ marginBottom: 2 }}
            />

            {/* URL de la imagen */}
            <TextField
              label="URL de la Imagen"
              fullWidth
              value={imageUrl}
              onChange={e => handleImageUrlChange(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            
            {/* Botón para marcar la URL como "Predeterminado" */}
            <Button
              variant="outlined"
              onClick={() => {
                setImageUrl("Predeterminado");
                setIsImageValid(true); // Cuando se marca como predeterminado, no hay validación
              }}
              sx={{ marginBottom: 2 }}
            >
              Predeterminado
            </Button>

            {/* Si la URL no es válida, mostrar un mensaje de error */}
            {!isImageValid && imageUrl && imageUrl !== "Predeterminado" && (
              <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                La URL de la imagen no es válida. Intenta con otra URL.
              </Typography>
            )}

            {/* Si hay una URL válida, mostrar vista previa de la imagen */}
            {isImageValid && imageUrl && imageUrl !== "Predeterminado" && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2" color="#AAA" mb={1}>
                  Vista previa de la imagen:
                </Typography>
                <img
                  src={imageUrl}
                  alt="Vista previa"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              </Box>
            )}
          </Box>

          {/* Columna derecha con el calendario */}
          <Box sx={{ width: '40%' }}>
            <Typography variant="body1" color="#AAA" mb={1} align="left">
              Fechas del Proyecto:
            </Typography>
            <DateRange
              ranges={dateRange}
              onChange={handleDateChange}
              locale={enGB}
              showMonthAndYearPickers
              color="#38BAC0"
              minDate={new Date()}  // Restricción para no seleccionar fechas anteriores a hoy
            />
          </Box>
        </Box>

        {/* Botones de Cancelar y Crear fuera de las cajas, al final */}
        <Box display="flex" justifyContent="space-between" marginTop={3}>
          <Button variant="outlined" onClick={() => router.push('/projects')}>
            Cancelar
          </Button>
          <Button
          variant="contained"
          color="primary"
          onClick={async () => {
          await handleSubmit(); // Llamamos a handleSubmit sin pasar el evento
          }}
        >
             Crear Proyecto
        </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateProject;
