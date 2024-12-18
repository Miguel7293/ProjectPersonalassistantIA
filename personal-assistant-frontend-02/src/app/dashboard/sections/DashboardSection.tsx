'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Avatar,
  Tooltip,
} from '@mui/material';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Interfaces para Tipos
interface Project {
  project_id: number;
  name: string;
  start_date: string;
  end_date: string;
  max_points: number;
  image_url: string;
  role: string; // ADMIN o COLLABORATOR
}

interface Task {
  task_id: number;
  project_id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  due_date?: string;
  status: string;
  priority: string;
  assigned_points: number;
  role: string; // ADMIN, COLLABORATOR, or USER
  edited_permitted: boolean;
  completion_percentage: number;
  total_completed: number;
  assigned_users: Array<{ user_id: number; username: string }>;
}

// Define las propiedades que DashboardSection espera recibir
interface DashboardSectionProps {
  userData: {
    token: string | null;
    username: string | null;
    id: string | null;
    email?: string | null;
    image_url?: string | null;
    unique_code?: string | null;
  };
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ userData }) => {
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

  // Función para obtener proyectos desde el backend
  const fetchProjects = async () => {
    if (!userData.id || !userData.token) {
      setError('El ID del usuario o el token no están disponibles.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/project/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({ sqlQuery: 'SELECT', User_ID: userData.id }),
      });

      const data = await response.json();

      if (data.ok) {
        setProjects(data.data);
      } else {
        setError(data.msg || 'No se pudieron obtener los proyectos.');
      }
    } catch (err: any) {
      setError('Ocurrió un error al cargar los proyectos.');
    }
  };

  // Función para obtener tareas de un proyecto desde el backend
  const fetchTasksByProject = async (projectId: number): Promise<Task[]> => {
    if (!userData.id || !userData.token) {
      setError('El ID del usuario o el token no están disponibles.');
      return [];
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({ sqlQuery: 'SELECT', Project_ID: projectId, user_id: userData.id }),
      });

      const data = await response.json();

      if (data.ok && Array.isArray(data.tasks)) {
        return data.tasks as Task[];
      } else {
        console.error(`Error al obtener tareas para el proyecto ID: ${projectId}`, data.msg);
        return [];
      }
    } catch (err: any) {
      console.error(`Error al obtener tareas para el proyecto ID: ${projectId}`, err);
      return [];
    }
  };

  // useEffect para obtener proyectos y luego sus tareas
  useEffect(() => {
    const fetchData = async () => {
      await fetchProjects();

      if (projects.length === 0) {
        setLoading(false);
        return;
      }

      // Después de obtener proyectos, obtener tareas para cada proyecto
      const tasksPromises = projects.map(async (project) => {
        const projectTasks = await fetchTasksByProject(project.project_id);
        // Agregar información del proyecto a cada tarea
        return projectTasks.map((task: Task) => ({
          ...task,
          projectRole: project.role, // Añadir el rol en el proyecto
          projectStatus: determineProjectStatus(project), // Determinar si está terminado o en progreso
        }));
      });

      const tasksResults = await Promise.all(tasksPromises);
      // Flatten el array de arrays de tareas
      const allTasks = tasksResults.flat();
      setTasks(allTasks);
      setLoading(false);
    };

    if (userData.id && userData.token) {
      fetchData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.id, userData.token, projects.length]); // Asegurarse de que useEffect se ejecuta después de obtener proyectos

  // Función para determinar el estado del proyecto
  const determineProjectStatus = (project: Project): string => {
    const today = new Date();
    const endDate = new Date(project.end_date);
    return endDate < today ? 'Terminado' : 'En Progreso';
  };

  // Reloj y Fecha
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${
        minutes < 10 ? '0' + minutes : minutes
      } ${ampm}`;

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const formattedDate = now.toLocaleDateString('es-ES', options); // Cambiar a español

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
      'El modelo de IA ha mostrado un alto nivel de precisión en las predicciones. Puede seguir mejorando con más datos.',
      'La tasa de participación está en aumento, lo que indica un buen nivel de interacción por parte de los usuarios.',
      'No se han detectado anomalías en los datos recientes, lo que es una señal positiva para la calidad del sistema.',
      'El análisis de sentimientos es mayormente positivo, lo que refleja una experiencia del usuario satisfactoria.',
    ];
    setIaComment(comments[Math.floor(Math.random() * comments.length)]);
  };

  // Saludo dinámico
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Buenos Días';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Buenas Tardes';
    } else {
      return 'Buenas Noches';
    }
  };
  const greeting = getGreeting(); // Obtener el saludo dinámicamente

  // Calcular estadísticas dinámicas
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task: Task) => task.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter((task: Task) => task.status !== 'COMPLETED').length;

  // Tareas pendientes hoy
  const tasksToday = tasks.filter((task: Task) => {
    const today = new Date();
    const taskDate = new Date(task.due_date || task.end_date || task.start_date);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear() &&
      task.status !== 'COMPLETED' // Solo tareas pendientes
    );
  }).length;

  // Datos para los gráficos basados en tareas
  const tasksByStatus = [
    { name: 'Completadas', value: completedTasks },
    { name: 'Pendientes', value: pendingTasks },
    { name: 'En Progreso', value: tasks.filter((task: Task) => task.status === 'IN_PROGRESS').length },
    { name: 'No Asignadas', value: tasks.filter((task: Task) => task.status === 'NOT_ASSIGNED').length },
  ];

  // Calcular tareas por proyecto
  const tasksPerProject = projects.map((project: Project) => {
    const projectTasks = tasks.filter((task: Task) => task.project_id === project.project_id);
    return {
      name: project.name,
      TaskCount: projectTasks.length,
    };
  });

  // Diferenciar proyectos por rol y estado
  const projectsAdmin = projects.filter((project: Project) => project.role === 'ADMIN');
  const projectsCollaborator = projects.filter((project: Project) => project.role === 'COLLABORATOR');

  const finishedProjects = projects.filter((project: Project) => determineProjectStatus(project) === 'Terminado');
  const inProgressProjects = projects.filter((project: Project) => determineProjectStatus(project) === 'En Progreso');

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
              src={userData.image_url || 'https://w.wallhaven.cc/full/w8/wallhaven-w8y3y6.png'} // Foto de perfil por defecto
              sx={{ width: 80, height: 80, marginRight: '20px' }}
            />

            <Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {greeting}, {userData.username || 'Usuario'}
              </Typography>
              <Typography variant="body1" color="text.secondary" title="Número de tareas pendientes programadas para hoy">
                Tienes {tasksToday} tareas pendientes hoy.
              </Typography>
            </Box>
          </Box>

          {/* Contenido del Dashboard */}
          <Grid container spacing={3}>
            {/* Tarjeta 1: Total de Proyectos */}
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                <CardContent>
                  <Typography variant="h6">Total Proyectos</Typography>
                  <Typography variant="h4" color="primary">
                    {totalProjects}
                  </Typography>
                  <Typography color="success.main">Número de proyectos activos</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tarjeta 2: Total de Tareas */}
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                <CardContent>
                  <Typography variant="h6">Total Tareas</Typography>
                  <Typography variant="h4" color="primary">
                    {totalTasks}
                  </Typography>
                  <Typography color="success.main">Total de tareas</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tarjeta 3: Tareas Completadas */}
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                <CardContent>
                  <Typography variant="h6">Tareas Completadas</Typography>
                  <Typography variant="h4" color="success.main">
                    {completedTasks}
                  </Typography>
                  <Typography color="success.main">Tareas completadas exitosamente</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tarjeta 4: Tareas Pendientes */}
            <Grid item xs={12} md={3}>
              <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                <CardContent>
                  <Typography variant="h6">Tareas Pendientes</Typography>
                  <Typography variant="h4" color="warning.main">
                    {pendingTasks}
                  </Typography>
                  <Typography color="text.secondary">Tareas por completar</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Sección de Gráficos */}
          <Box sx={{ marginTop: '30px' }}>
            <Typography variant="h5" gutterBottom>
              Métricas de Rendimiento & Insights
            </Typography>

            <Grid container spacing={3}>
              {/* Gráfico 1: Tareas por Estado */}
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                  <CardContent>
                    <Typography variant="h6">Tareas por Estado</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={tasksByStatus}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="value" name="Número de Tareas" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Gráfico 2: Tareas por Proyecto */}
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                  <CardContent>
                    <Typography variant="h6">Tareas por Proyecto</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={tasksPerProject}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="TaskCount" name="Número de Tareas" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Sección para IA y Análisis */}
          <Box sx={{ marginTop: '30px' }}>
            <Typography variant="h5" gutterBottom>
              Insights & Análisis de Datos con IA
            </Typography>

            <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
              <CardContent>
                <Typography variant="h6">Comentario de IA:</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '20px' }}>
                  {iaComment || "Haz clic en 'Generar Comentario de IA' para recibir insights del modelo."}
                </Typography>
                <Button variant="contained" color="primary" onClick={getIAComentary}>
                  Generar Comentario de IA
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Sección de Proyectos por Rol */}
          <Box sx={{ marginTop: '30px' }}>
            <Typography variant="h5" gutterBottom>
              Proyectos por Rol
            </Typography>

            <Grid container spacing={3}>
              {/* Proyectos como ADMIN */}
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                  <CardContent>
                    <Typography variant="h6">Proyectos donde eres ADMIN</Typography>
                    {projectsAdmin.length > 0 ? (
                      projectsAdmin.map((project: Project) => (
                        <Box key={project.project_id} sx={{ marginBottom: '10px' }}>
                          <Typography variant="subtitle1">{project.name}</Typography>
                          <Typography
                            variant="body2"
                            color={determineProjectStatus(project) === 'Terminado' ? 'success.main' : 'warning.main'}
                          >
                            {determineProjectStatus(project)}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2">No tienes proyectos como ADMIN.</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Proyectos como COLLABORATOR */}
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0' }}>
                  <CardContent>
                    <Typography variant="h6">Proyectos donde eres COLLABORATOR</Typography>
                    {projectsCollaborator.length > 0 ? (
                      projectsCollaborator.map((project: Project) => (
                        <Box key={project.project_id} sx={{ marginBottom: '10px' }}>
                          <Typography variant="subtitle1">{project.name}</Typography>
                          <Typography
                            variant="body2"
                            color={determineProjectStatus(project) === 'Terminado' ? 'success.main' : 'warning.main'}
                          >
                            {determineProjectStatus(project)}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2">No tienes proyectos como COLLABORATOR.</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DashboardSection;
