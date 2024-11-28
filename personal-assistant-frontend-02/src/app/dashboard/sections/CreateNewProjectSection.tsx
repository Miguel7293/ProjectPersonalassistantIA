import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '../../../../utils/api'; // Tu instancia de axios o API
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Start_Date: '',
    End_Date: '',
    Description: '',
  });

  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
          User_ID: 2,
          Project_ID: projectId,
        };

        const userProjectResponse = await api.post('/api/v1/project/operation', userProjectPayload);

        if (userProjectResponse.data.ok) {
          setMessage('User added to the project successfully!');
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
<Box
  sx={{
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo oscuro con transparencia
    backgroundImage: `url('https://w.wallhaven.cc/full/4y/wallhaven-4yjwxl.png')`, // Tu imagen de fondo
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <Card sx={{ maxWidth: 600, padding: 4, backgroundColor: 'rgba(30, 30, 30, 0.9)', color: 'white' }}>
    <CardContent>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
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
          InputLabelProps={{ style: { color: 'lightgray' } }}
          InputProps={{
            style: { color: 'white', borderColor: 'gray' },
          }}
        />

        <TextField
          label="Project Description"
          variant="outlined"
          fullWidth
          name="Description"
          value={formData.Description}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ style: { color: 'lightgray' } }}
          InputProps={{
            style: { color: 'white', borderColor: 'gray' },
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box width="48%">
              <DatePicker
                label="Start Date"
                value={formData.Start_Date ? dayjs(formData.Start_Date) : null}
                onChange={(newValue) =>
                  setFormData({ ...formData, Start_Date: newValue ? newValue.format('YYYY-MM-DD') : '' })
                }
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    margin: 'normal',
                    InputLabelProps: { style: { color: 'lightgray' } },
                    InputProps: { style: { color: 'white', borderColor: 'gray' } },
                  },
                }}
              />
            </Box>
            <Box width="48%">
              <DatePicker
                label="End Date"
                value={formData.End_Date ? dayjs(formData.End_Date) : null}
                onChange={(newValue) =>
                  setFormData({ ...formData, End_Date: newValue ? newValue.format('YYYY-MM-DD') : '' })
                }
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    margin: 'normal',
                    InputLabelProps: { style: { color: 'lightgray' } },
                    InputProps: { style: { color: 'white', borderColor: 'gray' } },
                  },
                }}
              />
            </Box>
          </Box>
        </LocalizationProvider>

        <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: 'primary.main', color: 'white', mt: 2 }}
            >
              Create Project
            </Button>

      </form>

      {message && (
        <Typography color="error" variant="body2" sx={{ marginTop: 2, color: 'lightgray' }}>
          {message}
        </Typography>
      )}
    </CardContent>
  </Card>
</Box>

  );
};

export default CreateProject;
