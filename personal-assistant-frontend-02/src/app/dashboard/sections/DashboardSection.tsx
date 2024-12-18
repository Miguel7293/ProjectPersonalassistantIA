'use client';

import { Box, Typography, Card, CardContent, Grid, Divider, Button, Avatar, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

// Interfaces para Tipos
interface Project {
  project_id: number;
  name: string;
  start_date: string;
  end_date: string;
  max_points: number;
  image_url: string;
  role: string;
}

interface Task {
  projectId: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  dueDate?: Date;
  status: string;
  priority: string;
  assignedPoints: number;
  id: number;
  role: string;
  editedPermitted: boolean;
  completionPercentage: number;
  totalCompleted: number;
}

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

  // Estados para proyectos y tareas
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener datos de userData desde localStorage
  const userData = {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    id: localStorage.getItem('userId'),
  };

  const projectId = localStorage.getItem('projectId');

  // Función para obtener proyectos desde el backend
  const fetchProjects = async () => {
    if (!userData.id) {
      setError('El ID del usuario no está disponible.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/project/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sqlQuery: 'SELECT', User_ID: userData.id }),
      });

      const data = await response.json();

      if (data.ok) {
        setProjects(data.data);
      } else {
        setError('No se pudieron obtener los proyectos.');
      }
    } catch (err) {
      setError('Ocurrió un error al cargar los proyectos.');
    }
  };

  // Función para obtener tareas desde el backend
  const fetchTasks = async () => {
    if (!projectId || !userData.id) {
      setError('El ID del proyecto o del usuario no está disponible.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sqlQuery: 'SELECT', Project_ID: projectId, user_id: userData.id }),
      });

      if (!response.ok) {
        setError('Error en la respuesta del servidor.');
        return;
      }

      const data = await response.json();

      if (data.ok && Array.isArray(data.tasks)) {
        const tasksWithDates = data.tasks.map((task: any): Task => ({
          projectId: task.project_id,
          title: task.title || 'Sin título',
          description: task.description || undefined,
          startDate: task.start_date ? new Date(task.start_date) : new Date(),
          endDate: task.end_date ? new Date(task.end_date) : undefined,
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          status: task.status || 'NOT ASSIGNED',
          priority: task.priority || 'LOW',
          assignedPoints: task.assigned_points || 0,
          id: task.task_id,
          role: task.role || 'UNKNOWN',
          editedPermitted: task.edited_permitted || false,
          completionPercentage: task.Completion_Percentage || 0,
          totalCompleted: task.Total_Completed || 0,
        }));

        setTasks(tasksWithDates);
      } else {
        setError('Formato inesperado en la respuesta.');
      }
    } catch (err) {
      setError('Error al obtener las tareas.');
    }
  };

  // useEffect para obtener proyectos y tareas al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      await fetchProjects();
      await fetchTasks();
      setLoading(false);
    };

    fetchData();
  }, [userData.id, projectId]);

  // Reloj y Fecha
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

  // Saludo dinámico
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

  // Calcular estadísticas dinámicas
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter(task => task.status !== 'COMPLETED').length;
  const tasksToday = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate || task.endDate || task.startDate);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  }).length;

  // Datos para los gráficos basados en tareas
  const tasksByStatus = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
    { name: 'In Progress', value: tasks.filter(task => task.status === 'IN_PROGRESS').length },
    { name: 'Not Assigned', value: tasks.filter(task => task.status === 'NOT_ASSIGNED').length },
  ];

  const tasksOverTime = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.project_id);
    const completed = projectTasks.filter(task => task.status === 'COMPLETED').length;
    const total = projectTasks.length;
    return {
      name: project.name,
      Completed: completed,
      Total: total,
    };
  });

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#121212', minHeight: '100vh', color: '#E0E0E0' }}>
      {loading ? (
        <Typography variant="h6" color="text.secondary">
          Cargando datos del dashboard...
        </Typography>
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <>
          <Box sx={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Reloj y fecha a la izquierda */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h4" sx={{ fontSize: '3rem' }}>
                {currentTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentDate}
              </Typography>
            </Box>

            {/* Opcional: Puedes añadir elementos adicionales aquí */}
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
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {greeting}, {userData.username || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You have {tasksToday} tasks today.
              </Typography>
            </Box>
          </Box>

          {/* Contenido del Dashboard */}
          <Grid container spacing={3}>
            {/* Tarjeta 1: Total de Proyectos */}
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                <CardContent>
                  <Typography variant="h6">Total Projects</Typography>
                  <Typography variant="h4" color="primary">
                    {totalProjects}
                  </Typography>
                  <Typography color="success.main">Number of active projects</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tarjeta 2: Total de Tareas */}
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                <CardContent>
                  <Typography variant="h6">Total Tasks</Typography>
                  <Typography variant="h4" color="primary">
                    {totalTasks}
                  </Typography>
                  <Typography color="success.main">Overall task count</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tarjeta 3: Tareas Completadas */}
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                <CardContent>
                  <Typography variant="h6">Completed Tasks</Typography>
                  <Typography variant="h4" color="success.main">
                    {completedTasks}
                  </Typography>
                  <Typography color="success.main">Tasks completed successfully</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tarjeta 4: Tareas Pendientes */}
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                <CardContent>
                  <Typography variant="h6">Pending Tasks</Typography>
                  <Typography variant="h4" color="warning.main">
                    {pendingTasks}
                  </Typography>
                  <Typography color="text.secondary">Tasks awaiting completion</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Sección de Gráficos */}
          <Box sx={{ marginTop: '30px' }}>
            <Typography variant="h5" gutterBottom>
              Performance Metrics & Insights
            </Typography>

            <Grid container spacing={3}>
              {/* Gráfico 1: Tareas por Estado */}
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                  <CardContent>
                    <Typography variant="h6">Tasks by Status</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={tasksByStatus}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" name="Number of Tasks" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Gráfico 2: Tareas por Proyecto */}
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                  <CardContent>
                    <Typography variant="h6">Tasks per Project</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={tasksOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Completed" name="Completed" stroke="#8884d8" />
                        <Line type="monotone" dataKey="Total" name="Total" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Sección para IA y Análisis */}
          <Box sx={{ marginTop: '30px' }}>
            <Typography variant="h5" gutterBottom>
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
        </>
      )}
    </Box>
  );
};

export default DashboardSection;
