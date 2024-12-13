import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { IoSend } from 'react-icons/io5';

interface GetData {
  userData: {
    token: string | null;
    username: string | null;
    id: string | null;
  };
}

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

// Definir las instrucciones en una variable separada
const INSTRUCTIONS = `
  Refierete a ti mismo como Lucy. Eres mi IA e interactúas con el usuario.
  Estas son instrucciones claras y deben respetarse a lo largo de la conversación:
  1. Serás amable en toda ocasión.
  2. Si el usuario menciona algo como "quiero hacer un proyecto" o "quiero programar una proyecto", 
     lo ayudarás solicitando tres datos: 
     - "fecha de inicio y fin", 
     - "título", 
     - "descripción". 
  Una vez que el usuario proporcione esos tres datos, responderás en formato JSON como:
  {"startDate": "2025-01-10", "endDate": "2025-03-02", "title": "Proyecto de trabajo", "description": "Ganar dinero"}.
  Si no se completan los tres datos, solicitarás los faltantes y solo después enviarás el JSON.

  Inicia la conversación con un saludo amable y presentándote.

  

`;

const ChatIASection: React.FC<GetData> = ({ userData }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const [hasSentInitialMessage, setHasSentInitialMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedMessages = [
    '¿Qué puedes hacer por mí?',
    'Puedes ayudarme a crear una Tarea',
    'Aconsejame cobre alguno de mis proyectos',
    'Solo necesito hablar',
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    setUserInput('');

    setMessages((prev) => [...prev, { sender: 'user', text: message }]);

    try {
      console.log('Enviando mensaje con ID de usuario:', userData.id);  // Mostrar el ID del usuario antes de enviarlo
      const response = await axios.post('http://localhost:5000/api/v1/chat/message', {
        prompt: message,
        user_id: userData.id,  // Incluyendo el ID del usuario en la solicitud
        token: userData.token,  // Usando el token para autenticar la solicitud
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
    if (hasSentInitialMessage) return;

    const sendInitialMessage = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/chat/message', {
          prompt: INSTRUCTIONS,  // Enviar las instrucciones separadas
          user_id: userData.id,  // Incluyendo el ID del usuario
          token: userData.token,  // Usando el token
        });
        const botResponse = response.data.response;
        setMessages([{ sender: 'bot', text: botResponse }]); // Inicia solo con el mensaje inicial
        setHasSentInitialMessage(true);  // Marca que el mensaje ya fue enviado
      } catch (error) {
        console.error('Error al enviar el mensaje predeterminado:', error);
      }
    };

    sendInitialMessage();
  }, [userData, hasSentInitialMessage]);

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
            <CircularProgress size={24} />
          </MessageBubble>
        )}
        <div ref={chatEndRef} />
      </MessagesContainer>

      {!isFirstInteraction && (
        <InputContainer>
          <TextField
            label="Escribe tu mensaje..."
            variant="outlined"
            fullWidth
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(userInput)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSendMessage(userInput)}
            sx={{ padding: '16px', minWidth: '50px' }}
          >
            <IoSend />
          </Button>
        </InputContainer>
      )}

      {isFirstInteraction && (
        <SuggestionsContainer>
          {suggestedMessages.map((msg, index) => (
            <SuggestionButton key={index} onClick={() => handleSuggestedMessageClick(msg)}>
              {msg}
            </SuggestionButton>
          ))}
        </SuggestionsContainer>
      )}
    </ChatContainer>
  );
};

export default ChatIASection;
