import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { IoSend } from 'react-icons/io5';

// Estilos personalizados sin pasar props innecesarios al DOM
const ChatContainer = styled(Paper)(({ theme }) => ({
  maxWidth: '800px',
  margin: '20px auto',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: '16px',
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '10px',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '10px',
  },
});

// El componente MessageBubble no pasa 'isUser' al DOM
const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',  // No permitir que 'isUser' pase al DOM
})<{ isUser?: boolean }>(({ isUser }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '16px',
  flexDirection: isUser ? 'row-reverse' : 'row',
}));

// El componente Message no pasa 'isUser' al DOM
const Message = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',  // No permitir que 'isUser' pase al DOM
})<{ isUser?: boolean }>(({ isUser, theme }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: isUser ? theme.palette.secondary.main : '#1E1E1E',
  color: isUser ? 'white' : theme.palette.text.primary,
  marginLeft: isUser ? '0' : '8px',
  marginRight: isUser ? '8px' : '0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  wordBreak: 'break-word',
}));

const InputContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  padding: '16px 0 0',
  borderTop: '1px solid #eee',
});

// Estilo para la lista de sugerencias verticales
const SuggestionsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',  // Cambiar a columna para disposición vertical
  gap: '10px',  // Espacio entre las sugerencias
  padding: '10px 0',
  maxHeight: '200px',  // Limitar la altura de las sugerencias
  overflowY: 'auto',  // Desplazamiento si es necesario
});

// Estilo individual de cada botón de sugerencia
const SuggestionButton = styled(Button)({
  backgroundColor: '#808080',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#696969',
  },
  borderRadius: '12px',
  padding: '8px 16px',
  textTransform: 'none',
  fontSize: '14px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
});

const ChatIASection = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([
    { sender: 'bot', text: '¡Hola! Soy Lucy tu asistente IA, ¿en qué puedo ayudarte hoy?' },
  ]);
  const [loading, setLoading] = useState(false);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedMessages = [
    '¿Cómo está el clima hoy?',
    '¿Qué puedes hacer por mí?',
    '¿Porque soy tan perfecto?',
    '¿Porque Paolito se enojo este dia si solo lo dejamos plantado en una reunion que planificamos?',
    'Muéstrame una imagen de un gato.',
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    setUserInput('');

    setMessages((prev) => [...prev, { sender: 'user', text: message }]);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/chat/message', {
        prompt: message,
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
    }
  };

  const handleSuggestedMessageClick = (message: string) => {
    handleSendMessage(message);
    setIsFirstInteraction(false);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ChatContainer>
      <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
        Lucy Assistant
      </Typography>

      <MessagesContainer id="messages-container">
        {messages.map((message, index) => (
          <MessageBubble key={index} isUser={message.sender === 'user'}>
            <Avatar
              sx={{
                bgcolor: message.sender === 'user' ? '#FF4081' : '#f50057',
                width: 32,
                height: 32,
              }}
              src="https://w.wallhaven.cc/full/4o/wallhaven-4o2w6l.jpg"
            />
            <Message isUser={message.sender === 'user'}>
              <Typography variant="body1">{message.text}</Typography>
            </Message>
          </MessageBubble>
        ))}
        {loading && (
          <MessageBubble isUser={false}>
            <Avatar
              sx={{
                bgcolor: '#f50057',
                width: 32,
                height: 32,
              }}
              src="https://w.wallhaven.cc/full/4o/wallhaven-4o2w6l.jpg"
            />
            <Message isUser={false}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography>Typing...</Typography>
              </Box>
            </Message>
          </MessageBubble>
        )}
        <div ref={chatEndRef} />
      </MessagesContainer>

      {isFirstInteraction && (
        <SuggestionsContainer>
          {suggestedMessages.map((suggestion, index) => (
            <SuggestionButton
              key={index}
              onClick={() => handleSuggestedMessageClick(suggestion)}
            >
              {suggestion}
            </SuggestionButton>
          ))}
        </SuggestionsContainer>
      )}

      <InputContainer>
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
          onClick={() => handleSendMessage(userInput)}
          sx={{
            minWidth: '100px',
            backgroundColor: '#FF4081',
            color: '#E0E0E0',
            padding: '12px 20px',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: '#FF5773',
            },
          }}
          disabled={!userInput.trim()}
          endIcon={<IoSend />}
        >
          Send
        </Button>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatIASection;
