import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '../../../../utils/api';  // Tu instancia de axios o API
import { DatePicker } from '@mui/x-date-pickers/DatePicker';  // Importar DatePicker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Start_Date: '',
    End_Date: '',
    Description: '',  // Agregado para manejar la descripción del proyecto
  });

  const [message, setMessage] = useState('');
  const router = useRouter();

  // Manejo de cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función que maneja el envío del formulario
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { Name, Start_Date, End_Date, Description } = formData;

    // Validaciones del lado del cliente
    if (!Start_Date || !End_Date || !Name) {
      setMessage('Name, Start Date, and End Date are required');
      return;
    }

    const requestPayload = {
      sqlQuery: 'INSERT',  // El tipo de consulta
      Name,
      Start_Date: dayjs(Start_Date).toISOString().split('T')[0],  // Convertir a formato YYYY-MM-DD
      End_Date: dayjs(End_Date).toISOString().split('T')[0],  // Convertir a formato YYYY-MM-DD
      Description  // Incluir la descripción en el payload
    };

    try {
      // Realizar la inserción del proyecto
      const response = await api.post('/api/v1/project/operation', requestPayload);

      if (response.data.ok) {
        setMessage('Project created successfully!');
        const projectId = response.data.data.project_id;  // Obtener el project_id desde la respuesta
        
        // Limpiar los campos después de la creación
        setFormData({ Name: '', Start_Date: '', End_Date: '', Description: '' });

        // Realizar el segundo insert para USER_PROJECT con el project_id y User_ID
        const userProjectPayload = {
          sqlQuery: 'INSERTRE',  // El tipo de consulta para insertar en USER_PROJECT
          User_ID: 2,  // El User_ID de ejemplo (deberías pasarlo dinámicamente)
          Project_ID: projectId  // El project_id que acabamos de recibir
        };

        // Realizar la inserción de la relación entre usuario y proyecto
        const userProjectResponse = await api.post('/api/v1/project/operation', userProjectPayload);

        if (userProjectResponse.data.ok) {
          setMessage('User added to the project successfully!');
          router.push('/ProjectSection');  // Redirigir a la sección de proyectos
        } else {
          setMessage(`Error adding user to project: ${userProjectResponse.data.msg}`);
        }
      } else {
        setMessage(`Error: ${response.data.msg || 'Failed to create project'}`);
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
      console.error(error);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create New Project
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Project Name"
              variant="outlined"
              fullWidth
              required
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              label="Project Description"
              variant="outlined"
              fullWidth
              name="Description"
              value={formData.Description}  // Asegúrate de que Description esté vinculado correctamente
              onChange={handleChange}
              margin="normal"
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" justifyContent="space-between" marginY={2} width="100%">
                <Box width="48%">
                  <DatePicker
                    label="Start Date"
                    value={formData.Start_Date ? dayjs(formData.Start_Date) : null}
                    onChange={(newValue) => setFormData({ ...formData, Start_Date: newValue ? newValue.format('YYYY-MM-DD') : '' })}
                    disablePast
                  />
                </Box>
                <Box width="48%">
                  <DatePicker
                    label="End Date"
                    value={formData.End_Date ? dayjs(formData.End_Date) : null}
                    onChange={(newValue) => setFormData({ ...formData, End_Date: newValue ? newValue.format('YYYY-MM-DD') : '' })}
                    disablePast
                  />
                </Box>
              </Box>
            </LocalizationProvider>

            <Button type="submit" variant="contained" fullWidth>
              Create Project
            </Button>
          </form>

          {message && <Typography color="error" variant="body2">{message}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateProject;
