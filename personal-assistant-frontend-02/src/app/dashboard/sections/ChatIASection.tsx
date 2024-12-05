import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, Avatar } from '@mui/material';

const ChatAISection = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([
    { sender: 'bot', text: '¡Hola! Soy tu asistente IA, ¿en qué puedo ayudarte hoy?' }, // Primer mensaje de la IA
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setLoading(true);

    // Agregar el mensaje del usuario al estado
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/chat/message', {
        prompt: userInput,
      });

      const botResponse = response.data.response;
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error: No se pudo obtener respuesta.' }
      ]);
    } finally {
      setLoading(false);
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
          flexDirection: 'column-reverse',
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
        <div ref={chatEndRef} />
      </Box>

      {/* Input de mensaje */}
      <Box sx={{ display: 'flex', alignItems: 'center', position: 'fixed', bottom: '20px', left: '20px', right: '20px' }}>
        <TextField
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          variant="outlined"
          sx={{
            backgroundColor: '#333',
            borderRadius: '20px',
            '& .MuiInputBase-root': {
              color: '#E0E0E0',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: '#666',
            },
          }}
          placeholder="Escribe un mensaje..."
        />

        <Button
          onClick={handleSendMessage}
          sx={{
            marginLeft: '10px',
            backgroundColor: '#1976D2',
            color: '#E0E0E0',
            padding: '12px 20px',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: '#1565C0',
            },
          }}
          aria-label="Enviar mensaje"
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
