'use client';

import { Box, Typography, Card, CardContent, Grid, TextField, Button, Avatar, Paper } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

const ChatAISection = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  
  // Ref para controlar el desplazamiento hacia abajo automáticamente
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // Función para manejar el envío de mensajes
  const handleSendMessage = () => {
    if (userInput.trim() !== '') {
      setMessages([
        ...messages,
        { sender: 'user', text: userInput },
        { sender: 'bot', text: 'Let me think about that...' }
      ]);
      setUserInput('');
    }
  };

  // Efecto para desplazarse hacia abajo cuando haya un nuevo mensaje
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#121212', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Título */}
      <Typography variant="h4" gutterBottom sx={{ color: '#E0E0E0' }}>
        Chat with AI Assistant
      </Typography>

      {/* Sección de Perfil */}
      <Box sx={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt="User Avatar"
          src="https://w.wallhaven.cc/full/4o/wallhaven-4o2w6l.jpg"
          sx={{ width: 80, height: 80, marginRight: '20px' }}
        />
        <Box>
          <Typography variant="h6" sx={{ color: '#E0E0E0' }}>
            Lucy
          </Typography>
          <Typography variant="body2" color="text.secondary">
            IA Specialist
          </Typography>
        </Box>
      </Box>

      {/* Área de Chat */}
      <Box
        sx={{
          backgroundColor: '#1E1E1E',
          padding: '20px',
          borderRadius: '10px',
          maxHeight: '60vh',
          overflowY: 'auto',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column-reverse'
        }}
      >
        {messages.map((message, index) => (
          <Paper
            key={index}
            sx={{
              backgroundColor: message.sender === 'user' ? '#3A3A3A' : '#2E2E2E',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px',
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
              {message.text}
            </Typography>
          </Paper>
        ))}
        <div ref={chatEndRef} /> {/* Esto es lo que ayuda a desplazarse automáticamente */}
      </Box>

      {/* Input de mensaje */}
<Box sx={{ display: 'flex', alignItems: 'center', position: 'fixed', bottom: '20px', left: '20px', right: '20px' }}>
  {/* Campo de texto para el mensaje */}
  <TextField
    fullWidth
    value={userInput}
    onChange={(e) => setUserInput(e.target.value)}
    variant="outlined"
    sx={{
      backgroundColor: '#333',  // Fondo oscuro para el campo de texto
      borderRadius: '20px',
      '& .MuiInputBase-root': {
        color: '#E0E0E0', // Texto claro en el campo de texto
      },
      '& .MuiOutlinedInput-root': {
        borderColor: '#666', // Bordes más suaves
      },
    }}
    placeholder="Escribe un mensaje..."
  />

  {/* Botón de Enviar */}
  <Button
    onClick={handleSendMessage}
    sx={{
      marginLeft: '10px',
      backgroundColor: '#1976D2', // Color del botón
      color: '#E0E0E0', // Color del texto en el botón
      padding: '12px 20px', // Tamaño del botón
      borderRadius: '50%',  // Hacerlo circular
      '&:hover': {
        backgroundColor: '#1565C0', // Hover para el botón
      },
    }}
    aria-label="Enviar mensaje"  // Etiqueta accesible
  >
    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '20px' }}>
      ➤
    </Typography>
  </Button>
</Box>

    </Box>
  );
};

export default ChatAISection;
