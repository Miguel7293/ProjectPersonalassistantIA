'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const EnviromentTask: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]); // Tareas guardadas en el backend
  const [localTasks, setLocalTasks] = useState<any[]>([]); // Tareas temporales no guardadas
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [isTaskListOpen, setIsTaskListOpen] = useState(false); // Controla la visibilidad de la lista de tareas

  const theme = useTheme();

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  const handleSelectSlot = (slotInfo: any) => {
    setDialogMode('add');
    setCurrentTask(null);
    setStartDate(slotInfo.start);
    setEndDate(slotInfo.end);
    setIsDialogOpen(true);
  };

  const addLocalTask = () => {
    const newTask = {
      id: `temp-${Date.now()}`, // ID temporal para tareas no guardadas
      title,
      description,
      start: startDate,
      end: endDate,
    };
    setLocalTasks([...localTasks, newTask]);
    setIsDialogOpen(false);
  };
  const handleDeleteTask = async (task: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sqlQuery: 'DELETE',
          Task_ID: task.id, // Asegúrate de enviar el ID de la tarea para eliminarla
        }),
      });
  
      if (response.ok) {
        // Si la tarea se elimina correctamente, actualizar la lista
        const updatedTasks = tasks.filter((t) => t.id !== task.id);
        setTasks(updatedTasks); // Actualizar las tareas en el estado
      } else {
        console.error('Error al eliminar la tarea');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error al eliminar la tarea:', err.message);
      } else {
        console.error('Error desconocido:', err);
      }
    }
  };
  
  const saveAllTasks = async () => {
    try {
      // Itera sobre cada tarea en la lista temporal y realiza la solicitud al backend
      for (const task of localTasks) {
        const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sqlQuery: 'INSERT',
            Project_ID: projectId,
            Title: task.title,
            Description: task.description,
            Start_Date: task.start?.toISOString(),
            End_Date: task.end?.toISOString(),
            Due_Date: task.end?.toISOString(),
            Status: 'Pending',
          }),
        });

        if (!response.ok) {
          console.error(`Error al guardar la tarea: ${task.title}`);
          continue; // Pasar a la siguiente tarea si hay un error
        }
      }

      // Después de guardar todas las tareas, recargar la lista desde el backend
      await fetchTasks(projectId!);

      // Limpiar tareas locales
      setLocalTasks([]);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error al guardar las tareas:', err.message);
      } else {
        console.error('Error desconocido:', err);
      }
    }
  };

  const openEditDialog = (task: any) => {
    setDialogMode('edit');
    setCurrentTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStartDate(task.start);
    setEndDate(task.end);
    setIsDialogOpen(true);
  };

  const formatDate = (date: string | Date | null): string => {
    if (!date) return 'Fecha no válida';
    return new Date(date).toLocaleString();
  };

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Enviroment Task Calendar
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: 2, color: theme.palette.text.primary }}>
        Organiza tus tareas en el calendario y guarda todas las tareas pendientes con el botón "Guardar todas las tareas".
      </Typography>

      <Calendar
        localizer={localizer}
        events={[...tasks, ...localTasks]} // Mostrar tareas guardadas y temporales
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(task) => openEditDialog(task)}
        style={{
          height: 500,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          backgroundColor: theme.palette.background.paper,
        }}
      />

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{dialogMode === 'add' ? 'Agregar Tarea' : 'Editar Tarea'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Título"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Descripción"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Fecha de Inicio"
            type="datetime-local"
            fullWidth
            value={startDate ? startDate.toISOString().slice(0, 16) : ''} // Ajustar a formato "YYYY-MM-DDTHH:MM"
            onChange={(e) => setStartDate(new Date(e.target.value))}
            margin="normal"
          />
          <TextField
            label="Fecha de Fin"
            type="datetime-local"
            fullWidth
            value={endDate ? endDate.toISOString().slice(0, 16) : ''} // Ajustar a formato "YYYY-MM-DDTHH:MM"
            onChange={(e) => setEndDate(new Date(e.target.value))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={addLocalTask}>
            {dialogMode === 'add' ? 'Agregar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {localTasks.length > 0 && (
        <Button variant="contained" color="secondary" sx={{ marginTop: 2 }} onClick={saveAllTasks}>
          Guardar todas las tareas
        </Button>
      )}

      <Button
        variant="outlined"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={() => setIsTaskListOpen(!isTaskListOpen)}
      >
        {isTaskListOpen ? 'Ocultar Lista de Tareas' : 'Mostrar Lista de Tareas'}
      </Button>

      {isTaskListOpen && (
  <Box sx={{ marginTop: 2 }}>
    <List>
      {[...tasks, ...localTasks].map((task) => (
        <ListItem key={task.id}>
          <ListItemText
            primary={task.title}
            secondary={`Descripción: ${task.description} | Inicio: ${formatDate(task.start)} | Fin: ${formatDate(task.end)}`}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => openEditDialog(task)} // Abrir el diálogo de edición
            >
              Modificar
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDeleteTask(task)} // Eliminar tarea
            >
              Eliminar
            </Button>
          </Box>
        </ListItem>
      ))}
    </List>
  </Box>
)}
    </Box>
  );
};

export default EnviromentTask;
