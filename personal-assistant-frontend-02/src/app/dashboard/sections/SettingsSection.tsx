import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

interface ProfileSettingsProps {
  userData: {
    email: string;
    image_url: string;
    username: string;
  };
  onUpdateUserData: (updatedData: { username?: string; image_url?: string }) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userData, onUpdateUserData }) => {
  const [formData, setFormData] = useState({
    email: userData.email,
    image_url: userData.image_url,
    username: userData.username,
    password: '', // Nueva propiedad
  });
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [editableFields, setEditableFields] = useState({
    image_url: false,
    username: false,
    password: false, // Controla si la contraseña es editable
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEditClick = (field: string) => {
    setEditableFields({ ...editableFields, [field]: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsChanged(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    setError('');
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await axios.put(
        'http://localhost:5000/api/v1/users/updateProfile',
        {
          name: formData.username, // Cambiar 'username' por 'name'
          password: formData.password,
          image_url: formData.image_url,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.ok) {
        setMessage('Profile updated successfully!');
        setIsChanged(false);
        setEditableFields({
          image_url: false,
          username: false,
          password: false,
        });
  
        // Actualiza el estado global y el almacenamiento local
        localStorage.setItem('username', formData.username);
        localStorage.setItem('image_url', formData.image_url);
        onUpdateUserData({
          username: formData.username,
          image_url: formData.image_url,
        });
      } else {
        setError(response.data.msg || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
  
      if (err.response) {
        setError(`Server responded with status: ${err.response.status}`);
      } else if (err.request) {
        setError('No response received from the server');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backgroundImage: `url('https://w.wallhaven.cc/full/4y/wallhaven-4yjwxl.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          padding: 4,
          backgroundColor: 'rgba(30, 30, 30, 0.9)',
          color: 'white',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
          Profile Settings
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Avatar */}
            <Box display="flex" justifyContent="center" mb={3}>
              <img
                src={formData.image_url}
                alt="Profile"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: '2px solid #FF4081',
                }}
              />
            </Box>

            {/* Campos del formulario */}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={formData.email}
              margin="normal"
              InputLabelProps={{ style: { color: 'lightgray' } }}
              InputProps={{
                style: {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              disabled
            />
            <Box display="flex" alignItems="center">
              <TextField
                label="Image URL"
                variant="outlined"
                fullWidth
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                margin="normal"
                disabled={!editableFields.image_url}
                InputLabelProps={{ style: { color: 'lightgray' } }}
                InputProps={{ style: { color: 'white' } }}
              />
              <IconButton onClick={() => handleEditClick('image_url')} sx={{ ml: 1 }}>
                <EditIcon sx={{ color: 'lightgray' }} />
              </IconButton>
            </Box>

            <Box display="flex" alignItems="center">
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                disabled={!editableFields.username}
                InputLabelProps={{ style: { color: 'lightgray' } }}
                InputProps={{ style: { color: 'white' } }}
              />
              <IconButton onClick={() => handleEditClick('username')} sx={{ ml: 1 }}>
                <EditIcon sx={{ color: 'lightgray' }} />
              </IconButton>
            </Box>

            {/* Campo de Contraseña */}
            <Box display="flex" alignItems="center">
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                type="password"
                disabled={!editableFields.password}
                InputLabelProps={{ style: { color: 'lightgray' } }}
                InputProps={{ style: { color: 'white' } }}
              />
              <IconButton onClick={() => handleEditClick('password')} sx={{ ml: 1 }}>
                <EditIcon sx={{ color: 'lightgray' }} />
              </IconButton>
            </Box>

            {/* Botón Guardar */}
            <Button
              variant="contained"
              fullWidth
              disabled={!isChanged}
              onClick={handleSubmit}
              sx={{
                bgcolor: isChanged ? 'primary.main' : 'gray',
                color: 'white',
                mt: 2,
                ':hover': { bgcolor: isChanged ? 'primary.dark' : 'gray' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
            </Button>

            {message && (
              <Typography sx={{ color: '#FF4081', mt: 2, textAlign: 'center' }}>
                {message}
              </Typography>
            )}
            {error && (
              <Typography sx={{ color: 'red', mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProfileSettings;
