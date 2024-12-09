'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  useTheme,
  Chip,
  Slider,
} from '@mui/material';

const TaskManagement: React.FC = () => {
  const theme = useTheme();

  // Estado para las tareas
  const [tasks, setTasks] = useState([
    {
      projectId: 1,
      title: 'Diseñar mockups para la aplicación',
      description: 'Crear un diseño inicial para las pantallas principales de la app.',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-10'),
      dueDate: new Date('2024-12-15'),
      status: 'PROGRESS',
      priority: 'HIGH',
      assignedPoints: 10,
      currentPoints: 0,
    },
    {
      projectId: 1,
      title: 'Revisar los requerimientos',
      description: 'Analizar los requerimientos proporcionados por el cliente.',
      startDate: new Date('2024-12-05'),
      endDate: new Date('2024-12-08'),
      dueDate: new Date('2024-12-10'),
      status: 'COMPLETED',
      priority: 'MEDIUM',
      assignedPoints: 5,
      currentPoints: 5,
    },
  ]);

  // Estados adicionales
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openProgressDialog, setOpenProgressDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [sliderValue, setSliderValue] = useState(0);

  // Métodos para manejar diálogos
  const handleEditDialogToggle = (task?: any) => {
    setCurrentTask(task || null);
    setOpenEditDialog(!openEditDialog);
  };

  const handleProgressDialogToggle = (task?: any) => {
    setCurrentTask(task || null);
    setSliderValue(task?.currentPoints || 0);
    setOpenProgressDialog(!openProgressDialog);
  };

  const saveProgress = () => {
    if (currentTask) {
      const updatedTasks = tasks.map((task) =>
        task === currentTask ? { ...task, currentPoints: sliderValue } : task
      );
      setTasks(updatedTasks);
    }
    setOpenProgressDialog(false);
  };

  return (
    <Box
      padding={4}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        backdropFilter: 'blur(5px)',
        backgroundImage: 'url(https://w.wallhaven.cc/full/yx/wallhaven-yxwd97.png)',
        backgroundSize: 'cover',
      }}
    >
      {/* Header */}
      <Typography variant="h4" gutterBottom color={theme.palette.primary.main} sx={{ opacity: 0.8 }}>
        Gestión de Tareas
      </Typography>

      {/* Task List */}
      <TableContainer>
        <Table sx={{ opacity: 0.9 }}>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Límite</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Puntos</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.startDate.toLocaleDateString()}</TableCell>
                <TableCell>{task.endDate?.toLocaleDateString() || 'No definido'}</TableCell>
                <TableCell>
                  <Chip label={task.status} color={task.status === 'COMPLETED' ? 'success' : 'warning'} />
                </TableCell>
                <TableCell>{`${task.currentPoints}/${task.assignedPoints}`}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEditDialogToggle(task)}>
                    EDITAR
                  </Button>
                  <Button size="small" onClick={() => handleProgressDialogToggle(task)}>
                    PROGRESO
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Task Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogToggle} fullWidth maxWidth="md">
        <DialogTitle>Editar Tarea</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Título"
            value={currentTask?.title || ''}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, title: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            label="Descripción"
            value={currentTask?.description || ''}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogToggle}>Cancelar</Button>
          <Button variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={openProgressDialog} onClose={handleProgressDialogToggle} fullWidth maxWidth="sm">
        <DialogTitle>Progreso de Tarea</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Puntos actuales: {sliderValue} / {currentTask?.assignedPoints}
          </Typography>
          <Slider
            value={sliderValue}
            min={0}
            max={currentTask?.assignedPoints || 10}
            step={1}
            onChange={(e, value) => setSliderValue(value as number)}
            sx={{ mb: 4 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProgressDialogToggle}>Cancelar</Button>
          <Button variant="contained" color={sliderValue === currentTask?.assignedPoints ? 'success' : 'primary'} onClick={saveProgress}>
            {sliderValue === currentTask?.assignedPoints ? 'TERMINAR' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManagement;








useEffect(() => {
    const storedProjectId = localStorage.getItem('projectId');
    setProjectId(storedProjectId);
    if (storedProjectId) fetchTasks(storedProjectId);
  }, []);

  const fetchTasks = async (projectId: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sqlQuery: 'SELECT', Project_ID: projectId }),
      });
      const data = await response.json();
      if (data.ok) setTasks(data.data);
      else console.error('Error fetching tasks:', data.message);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error al obtener las tareas:', err.message);
      } else {
        console.error('Error desconocido:', err);
      }
    }
  };















  return (
    <Box
      padding={4}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        color: theme.palette.text.primary,
      }}
    >
      {/* Imagen de fondo con opción dinámica */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://w.wallhaven.cc/full/we/wallhaven-we92z6.png)', //
          backgroundSize: backgroundSize,
          backgroundPosition: 'center',
          filter: 'opacity(0.5)',
          zIndex: -1,
        }}
      />

      {/* Contenido principal */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom sx={{ opacity: 0.9 }}>
          Gestión de Tareas
        </Typography>

        {/* Opciones de configuración */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ opacity: 0.9 }}>
          <FormControl sx={{ width: '200px' }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select defaultValue="recent" label="Ordenar por">
              <MenuItem value="recent">Más Recientes</MenuItem>
              <MenuItem value="name">Por Nombre</MenuItem>
              <MenuItem value="priority">Más Importantes</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: '200px' }}>
            <InputLabel>Fondo</InputLabel>
            <Select value={backgroundSize} onChange={(e) => setBackgroundSize(e.target.value as any)} label="Fondo">
              <MenuItem value="cover">Cubrir</MenuItem>
              <MenuItem value="contain">Ajustar</MenuItem>
              <MenuItem value="auto">Auto</MenuItem>
            </Select>
          </FormControl>
          <Box>
            <Button variant="contained" color="primary" onClick={handleTaskDialogToggle} sx={{ marginRight: 2 }}> {/*sx={{ marginRight: 2, backgroundColor: 'black', color: 'white' }}*/}
              Añadir Tarea
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCollaboratorsDialogToggle}>
              Ver Colaboradores
            </Button>
          </Box>
        </Box>

        {/* Lista de Tareas */}
        <TableContainer sx={{ opacity: 0.9 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Límite</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Puntos</TableCell>
                <TableCell>Prioridad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.startDate.toLocaleDateString()}</TableCell>
                  <TableCell>{task.endDate?.toLocaleDateString() ?? 'No definido'}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={task.status === 'COMPLETED' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>{task.assignedPoints}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditDialogToggle(task)} color="primary">
                      Editar
                    </Button>
                    <Button onClick={() => handleProgressDialogToggle(task)} color="secondary">
                      Progreso
                    </Button>
                    <Button onClick={() => handleProgressDialogToggle(task)} color="primary">
                      Asignar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};