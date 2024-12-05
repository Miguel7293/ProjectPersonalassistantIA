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
        onSelectSlot={(slotInfo) => {
          setDialogMode('add');
          setCurrentTask(null);
          setStartDate(slotInfo.start);
          setEndDate(slotInfo.end);
          setIsDialogOpen(true);
        }}
        onSelectEvent={(task) => openEditDialog(task)}
        style={{
          height: 500,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      />

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
              <ListItem key={task.id} sx={{ padding: 2 }}>
                <ListItemText
                  primary={task.title}
                  secondary={`Descripción: ${task.description} | Inicio: ${formatDate(task.start_date)} | Fin: ${formatDate(task.end_date)}`}
                />
                <Button variant="outlined" color="error" onClick={() => handleDeleteTask(task)}>
                  Eliminar
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default EnviromentTask;
