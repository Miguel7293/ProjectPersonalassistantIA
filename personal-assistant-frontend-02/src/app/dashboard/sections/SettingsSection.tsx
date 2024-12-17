'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';


const ProfileSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    profileUrl: '',
    name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [editableFields, setEditableFields] = useState({
    profileUrl: false,
    name: false,
    password: false,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Cargar datos del usuario desde la API
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:5000/api/getDashboardProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data.user;
        setFormData({
          email: user.email,
          profileUrl: user.image_url || '/static/images/avatar/1.jpg',
          name: user.name,
          password: '',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
      const response = await axios.put(
        'http://localhost:5000/api/updateProfile',
        {
          name: formData.name,
          password: formData.password,
          image_url: formData.profileUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.ok) {
        setMessage('Profile updated successfully!');
        setIsChanged(false);
        setEditableFields({
          profileUrl: false,
          name: false,
          password: false,
        });
      } else {
        setError(response.data.msg || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error connecting to server');
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
      <Card
        sx={{
          maxWidth: 500,
          padding: 4,
          backgroundColor: 'rgba(30, 30, 30, 0.9)',
          color: 'white',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        <CardContent>
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
                <Avatar
                  src={formData.profileUrl}
                  alt="Profile Picture"
                  sx={{ width: 80, height: 80, border: '2px solid #FF4081' }}
                />
              </Box>

              {/* Campos del formulario */}
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={formData.email}
                margin="normal"
                disabled
                InputLabelProps={{ style: { color: 'lightgray' } }}
                InputProps={{ style: { color: 'white' } }}
              />
              <Box display="flex" alignItems="center">
                <TextField
                  label="Profile URL"
                  variant="outlined"
                  fullWidth
                  name="profileUrl"
                  value={formData.profileUrl}
                  onChange={handleChange}
                  margin="normal"
                  disabled={!editableFields.profileUrl}
                  InputLabelProps={{ style: { color: 'lightgray' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
                <IconButton onClick={() => handleEditClick('profileUrl')} sx={{ ml: 1 }}>
                  <EditIcon sx={{ color: 'lightgray' }} />
                </IconButton>
              </Box>

              <Box display="flex" alignItems="center">
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  disabled={!editableFields.name}
                  InputLabelProps={{ style: { color: 'lightgray' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
                <IconButton onClick={() => handleEditClick('name')} sx={{ ml: 1 }}>
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileSettings;
