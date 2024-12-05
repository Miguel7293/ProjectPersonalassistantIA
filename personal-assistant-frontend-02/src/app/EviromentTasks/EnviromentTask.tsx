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
  const [tasks, setTasks] = useState<any[]>([]);
  const [localTasks, setLocalTasks] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);

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
      if (data.ok) {
        // Map task_id to id for consistent access
        const updatedTasks = data.data.map((task: any) => ({
          ...task,
          id: task.task_id, // Map task_id to id
        }));
        setTasks(updatedTasks);
      } else console.error('Error fetching tasks:', data.message);
    } catch (err) {
      console.error('Error al obtener las tareas:', err);
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
      id: `temp-${Date.now()}`,
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
        body: JSON.stringify({ sqlQuery: 'DELETE', Task_ID: task.id }),
      });

      if (response.ok) {
        const updatedTasks = tasks.filter((t) => t.id !== task.id);
        setTasks(updatedTasks);
      } else {
        console.error('Error al eliminar la tarea');
      }
    } catch (err) {
      console.error('Error al eliminar la tarea:', err);
    }
  };

  const saveAllTasks = async () => {
    try {
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
          continue;
        }
      }

      await fetchTasks(projectId!);
      setLocalTasks([]);
    } catch (err) {
      console.error('Error al guardar las tareas:', err);
    }
  };

  const openEditDialog = (task: any) => {
    setDialogMode('edit');
    setCurrentTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStartDate(new Date(task.start_date));
    setEndDate(new Date(task.end_date));
    setIsDialogOpen(true);
  };

  const formatDate = (date: string | Date | null): string => {
    if (!date) return 'Fecha no válida';
    return new Date(date).toLocaleString();
  };


  const handleEditTask = async () => {
    if (!currentTask) return;

    try {
      const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sqlQuery: 'UPDATE',
          Task_ID: currentTask.id,
          Title: title,
          Description: description,
          Start_Date: startDate?.toISOString(),
          End_Date: endDate?.toISOString(),
        }),
      });

      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task.id === currentTask.id
            ? { ...task, title, description, start_date: startDate, end_date: endDate }
            : task
        );
        setTasks(updatedTasks);
        setIsDialogOpen(false);
      } else {
        console.error('Error al actualizar la tarea');
      }
    } catch (err) {
      console.error('Error al actualizar la tarea:', err);
    }
  };

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Enviroment Task Calendar
      </Typography>

      <Calendar
        localizer={localizer}
        events={[...tasks, ...localTasks]}
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
          color: theme.palette.text.primary,
        }}
      />
<Dialog
  open={isDialogOpen}
  onClose={() => setIsDialogOpen(false)}
  PaperProps={{
    sx: {
      backgroundColor: "#000000", // Fondo oscuro sin gris
      color: theme.palette.text.primary,               // Texto claro
    },
  }}
>
  <DialogTitle sx={{ color: theme.palette.text.primary }}>
    {dialogMode === 'add' ? 'Agregar Tarea' : 'Editar Tarea'}
  </DialogTitle>
  <DialogContent>
    <TextField
      label="Título"
      fullWidth
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      margin="normal"
      InputProps={{
        sx: {
          backgroundColor: theme.palette.background.paper, // Fondo oscuro para los campos
          color: theme.palette.text.primary,               // Texto claro
        },
      }}
      InputLabelProps={{
        sx: {
          color: theme.palette.text.secondary,            // Etiqueta del campo
        },
      }}
    />
    <TextField
      label="Descripción"
      fullWidth
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      margin="normal"
      InputProps={{
        sx: {
          backgroundColor: theme.palette.background.paper, // Fondo oscuro para los campos
          color: theme.palette.text.primary,               // Texto claro
        },
      }}
      InputLabelProps={{
        sx: {
          color: theme.palette.text.secondary,            // Etiqueta del campo
        },
      }}
    />
    <TextField
      label="Fecha de Inicio"
      type="datetime-local"
      fullWidth
      value={startDate ? startDate.toISOString().slice(0, 16) : ''}
      onChange={(e) => setStartDate(new Date(e.target.value))}
      margin="normal"
      InputProps={{
        sx: {
          backgroundColor: theme.palette.background.paper, // Fondo oscuro
          color: theme.palette.text.primary,
        },
      }}
      InputLabelProps={{
        sx: {
          color: theme.palette.text.secondary,
        },
      }}
    />
    <TextField
      label="Fecha de Fin"
      type="datetime-local"
      fullWidth
      value={endDate ? endDate.toISOString().slice(0, 16) : ''}
      onChange={(e) => setEndDate(new Date(e.target.value))}
      margin="normal"
      InputProps={{
        sx: {
          backgroundColor: theme.palette.background.paper, // Fondo oscuro
          color: theme.palette.text.primary,
        },
      }}
      InputLabelProps={{
        sx: {
          color: theme.palette.text.secondary,
        },
      }}
    />
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setIsDialogOpen(false)}
      sx={{
        color: theme.palette.text.secondary,
      }}
    >
      Cancelar
    </Button>
    <Button
      variant="contained"
      color="primary"
      onClick={addLocalTask}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
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
              <ListItem
                key={task.id}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  marginBottom: 1,
                  padding: 2,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <ListItemText
                  primary={task.title}
                  secondary={`Descripción: ${task.description} | Inicio: ${formatDate(task.start_date)} | Fin: ${formatDate(task.end_date)}`}
                  sx={{ color: theme.palette.text.primary }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => openEditDialog(task)}

                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteTask(task)}
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
