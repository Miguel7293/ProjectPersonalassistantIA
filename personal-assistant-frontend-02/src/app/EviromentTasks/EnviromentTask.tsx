'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';

import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configuración de la localización con date-fns
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
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Task 1', start: new Date(2024, 11, 1), end: new Date(2024, 11, 2) },
    { id: 2, title: 'Task 2', start: new Date(2024, 11, 5), end: new Date(2024, 11, 6) },
  ]);

  const handleSelectSlot = (slotInfo: any) => {
    const newTask = { 
      id: tasks.length + 1, 
      title: 'New Task', 
      start: slotInfo.start, 
      end: slotInfo.end 
    };
    setTasks([...tasks, newTask]);
  };

  const theme = useTheme();

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Enviroment Task Calendar
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: 2, color: theme.palette.text.primary }}>
        Organiza tus tareas en el calendario haciendo clic y arrastrando para definir fechas.
      </Typography>

      {/* Mostrar el número de tareas programadas */}
      {tasks.length > 0 && (
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}>
          Tienes {tasks.length} tarea{tasks.length > 1 ? 's' : ''} programada{tasks.length > 1 ? 's' : ''} en el calendario.
        </Typography>
      )}

      {/* Calendar Component */}
      <Calendar
        localizer={localizer}
        events={tasks}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{
          height: 500,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          backgroundColor: theme.palette.background.paper,
        }}
      />

      <Button
        variant="contained"
        color="secondary"
        sx={{ marginTop: 2 }}
        onClick={() => console.log('Agregando una tarea manualmente')}
      >
        Agregar tarea manualmente
      </Button>
    </Box>
  );
};

export default EnviromentTask;
