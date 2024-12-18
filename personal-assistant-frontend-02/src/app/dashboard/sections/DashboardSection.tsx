'use client';

import { Box, Typography, Card, CardContent, Grid, Divider, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Datos simulados para los gráficos
const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const DashboardSection = () => {
  const [iaComment, setIaComment] = useState('');
  const [statData, setStatData] = useState({
    predictionAccuracy: 92,
    sentimentAnalysis: 'Positive',
    anomalyDetection: 'No anomalies detected',
    engagementRate: 76,
  });

  // Reloj
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const formattedDate = now.toLocaleDateString('en-US', options);

      setCurrentTime(formattedTime);
      setCurrentDate(formattedDate);
    };

    // Actualiza cada segundo
    const interval = setInterval(updateTime, 1000);

    // Llamada inicial
    updateTime();

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  // Comentarios generados por IA
  const getIAComentary = () => {
    const comments = [
      "El modelo de IA ha mostrado un alto nivel de precisión en las predicciones. Puede seguir mejorando con más datos.",
      "La tasa de participación está en aumento, lo que indica un buen nivel de interacción por parte de los usuarios.",
      "No se han detectado anomalías en los datos recientes, lo que es una señal positiva para la calidad del sistema.",
      "El análisis de sentimientos es mayormente positivo, lo que refleja una experiencia del usuario satisfactoria.",
    ];
    setIaComment(comments[Math.floor(Math.random() * comments.length)]);
  };
  const tasks = 5;

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  const greeting = getGreeting(); // Obtener el saludo dinámicamente


  return (
    <Box sx={{ padding: '20px', backgroundColor: '#121212', minHeight: '100vh' }}>
    <Box sx={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Reloj y fecha a la izquierda */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="h4" sx={{ color: '#E0E0E0', fontSize: '3rem' }}> {/* Tamaño más grande para la hora */}
          {currentTime}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentDate}
        </Typography>
      </Box>


    </Box>

    <Divider sx={{ marginBottom: '20px', bgcolor: '#333' }} />

    <Box sx={{ marginBottom: '40px', display: 'flex', alignItems: 'center' }}>
      {/* Avatar y saludo juntos */}
      <Avatar
        alt="User Avatar"
        src="https://w.wallhaven.cc/full/w8/wallhaven-w8y3y6.png" // Foto de perfil por defecto
        sx={{ width: 80, height: 80, marginRight: '20px' }}
      />

      <Box>
        <Typography variant="h3" sx={{ color: '#E0E0E0', fontWeight: 'bold' }}>
          {greeting}, User
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You have {tasks} tasks today.
        </Typography>
      </Box>
    </Box>



      {/* Contenido del Dashboard */}
      <Grid container spacing={3}>
        {/* Tarjeta 1: Precisión del modelo */}
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
            <CardContent>
              <Typography variant="h6">Prediction Accuracy</Typography>
              <Typography variant="h4" color="primary">
                {statData.predictionAccuracy}%
              </Typography>
              <Typography color="success.main">High accuracy rate</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 2: Análisis de Sentimiento */}
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
            <CardContent>
              <Typography variant="h6">Sentiment Analysis</Typography>
              <Typography variant="h4" color={statData.sentimentAnalysis === 'Positive' ? 'success.main' : 'error.main'}>
                {statData.sentimentAnalysis}
              </Typography>
              <Typography color="text.secondary">User sentiment is being monitored.</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 3: Detección de Anomalías */}
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
            <CardContent>
              <Typography variant="h6">Anomaly Detection</Typography>
              <Typography variant="h4" color={statData.anomalyDetection === 'No anomalies detected' ? 'success.main' : 'error.main'}>
                {statData.anomalyDetection}
              </Typography>
              <Typography color="text.secondary">No issues detected in the current data.</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tarjeta 4: Tasa de Participación */}
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
            <CardContent>
              <Typography variant="h6">Engagement Rate</Typography>
              <Typography variant="h4" color="primary">
                {statData.engagementRate}%
              </Typography>
              <Typography color="success.main">Growing user engagement</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sección de Gráficos */}
      <Box sx={{ marginTop: '30px' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#E0E0E0' }}>
          Performance Metrics & Insights
        </Typography>

        <Grid container spacing={3}>
          {/* Gráfico de desempeño */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
              <CardContent>
                <Typography variant="h6">Model Accuracy Over Time</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de participación */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
              <CardContent>
                <Typography variant="h6">User Engagement Trends</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Sección para IA y Análisis */}
      <Box sx={{ marginTop: '30px' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#E0E0E0' }}>
          AI Insights & Data Analysis
        </Typography>

        <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
          <CardContent>
            <Typography variant="h6">AI Commentary:</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '20px' }}>
              {iaComment || "Click 'Generate AI Commentary' to receive insights from the model."}
            </Typography>
            <Button variant="contained" color="primary" onClick={getIAComentary}>
              Generate AI Commentary
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardSection;
