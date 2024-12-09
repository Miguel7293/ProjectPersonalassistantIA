'use client';
import { Collaborator2 } from './types';  // Ajusta la ruta según la ubicación de tu archivo de tipos
import { Task } from './types';  // Ajusta la ruta según la ubicación de tu archivo de tipos
import { CollaboratorProject } from './types';  // Ajusta la ruta según la ubicación de tu archivo de tipos

import React, { useState, useEffect } from 'react';
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
  AvatarGroup,
  Avatar,
  Slider,
  Popover,

} from '@mui/material';

import { DateRange } from 'react-date-range'; // Importación de react-date-range
import { enGB } from 'date-fns/locale'; // Idioma en inglés (puedes cambiarlo a español)
import 'react-date-range/dist/styles.css'; // Estilos predeterminados
import 'react-date-range/dist/theme/default.css'; // Tema predeterminado

    // Función para obtener los colaboradores del proyecto
    const fetchCollaborators = async (projectId: string) => {
      const projectIdNumber = parseInt(projectId, 10); // Convertimos el ID a número aquí
      if (isNaN(projectIdNumber)) {
        console.error('El Project ID no es válido');
        return []; // Retorna un arreglo vacío en caso de error
      }
      const response = await fetch(`http://localhost:5000/api/v1/project/${projectIdNumber}/collaborators`);
      const data = await response.json();
      return data.ok ? data.data : [];
    };
    
const TaskManagement: React.FC = () => {
  const theme = useTheme();




  // Estado para los diálogos
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openCollaboratorsDialog, setOpenCollaboratorsDialog] = useState(false);
  const [editTaskDialog, setEditTaskDialog] = useState(false);
  const [progressDialog, setProgressDialog] = useState(false);

  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Estado para la configuración del fondo
  const [backgroundSize, setBackgroundSize] = useState<'cover' | 'contain' | 'auto'>('cover');

  // Métodos para manejar diálogos
  const handleTaskDialogToggle = () => setOpenTaskDialog(!openTaskDialog);
  const handleCollaboratorsDialogToggle = () => setOpenCollaboratorsDialog(!openCollaboratorsDialog);
  const handleEditDialogToggle = (task: any) => {
    setSelectedTask(task);
    setEditTaskDialog(!editTaskDialog);
  };
  //const handleProgressDialogToggle = (task: any) => {
  //  setSelectedTask(task);
  //  setProgressDialog(!progressDialog);
  //};


  
  useEffect(() => {
    const storedProjectId = localStorage.getItem('projectId');
    console.log('Project ID:', storedProjectId); 
    setProjectId(storedProjectId);
    if (storedProjectId) {
      fetchTasks(storedProjectId);
    }
  }, []);

  const fetchTasks = async (projectId: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sqlQuery: 'SELECT', Project_ID: projectId }),
      });
      const data = await response.json();
      console.log(data);
      if (data.ok) {
        // Convertir las fechas a objetos Date
        const tasksWithDates = data.data.map((task: any) => ({
          ...task,
          startDate: new Date(task.start_date),
          endDate: task.end_date ? new Date(task.end_date) : undefined,
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
        }));
        setTasks(tasksWithDates);
      } else {
        console.error('Error fetching tasks:', data.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error al obtener las tareas:', err.message);
      } else {
        console.error('Error desconocido:', err);
      }
    }
  };

/////////////////////////////////////////////////// PARA LA CREACION DE TAREAS ///////////////////////////////////


    // Estado para las tareas
    const [tasks, setTasks] = useState<any[]>([]);  
    const [projectId, setProjectId] = useState<string | null>(null);

  


    // Estados para la tarea
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [priority, setPriority] = useState('HIGH');
    const [assignedPoints, setAssignedPoints] = useState(0);
    const [Total_Completed, setTotal_Completed  ] = useState(0);

    const [assignedUserId, setAssignedUserId] = useState<number | null>(null); // Usuario predeterminado en null
    const [collaborators, setCollaborators] = useState<any[]>([]);

    const [dateRange, setDateRange] = useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);

      // Obtener los colaboradores del proyecto al cargar el componente
      useEffect(() => {
        const storedProjectId = localStorage.getItem('projectId');
        console.log('Project ID:', storedProjectId); 
        
        // Verificamos si storedProjectId no es null
        if (storedProjectId) {
          setProjectId(storedProjectId); // Guardamos el Project ID como string
      
          const loadCollaborators = async () => {
            const collaboratorsData = await fetchCollaborators(storedProjectId); // Usamos el ID como string aquí
            setCollaborators(collaboratorsData);
          };
      
          loadCollaborators();
        } else {
          console.error('No se encontró el Project ID en el localStorage');
        }
      }, []);
      
    const handleDateChange = (ranges: any) => {
      setDateRange([ranges.selection]);
      setStartDate(ranges.selection.startDate);
      setEndDate(ranges.selection.endDate);
    };
    const handleSaveTask = async () => {
      const taskData: any = {
        sqlQuery: 'INSERT',
        Project_ID: projectId, // Asegúrate de obtener el Project_ID adecuado
        Title: title,
        Description: description,
        Start_Date: startDate.toISOString(),
        End_Date: endDate.toISOString(),
        Due_Date: dueDate.toISOString(),
        Status: 'NOT STARTED',
        Priority: priority,
        Assigned_Points: assignedPoints,
      };
    
      // Log para verificar el valor de assignedUserId antes de agregarlo
      console.log('assignedUserId antes de agregarlo:', assignedUserId);
    
      // Solo agregamos Assigned_User_ID si assignedUserId no es null
      if (assignedUserId !== null) {
        taskData.Assigned_User_ID = assignedUserId;
        console.log('assignedUserId agregado:', assignedUserId); // Log para verificar que Assigned_User_ID fue agregado
      } else {
        console.log('No se agregó Assigned_User_ID porque assignedUserId es null');
      }
    
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        const data = await response.json();
        if (data.ok) {
          console.log('Tarea creada con éxito');
          setOpenTaskDialog(false); // Cerrar el modal
        } else {
          console.error('Error al crear la tarea:', data.message);
        }
      } catch (err) {
        console.error('Error al hacer la solicitud:', err);
      }
    };
    
    
    
    ////////////////////////////////////////////

    /////////////////////////////////////////////////// PARA LA EDICION DE TAREAS ///////////////////////////////////
    
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [taskData, setTaskData] = useState(null); // Aquí almacenamos la información de la tarea seleccionada
    const [openEditDialog, setOpenEditDialog] = useState(false); // Para controlar si el modal está abierto

    const [collaborators2, setCollaborators2] = useState<Collaborator2[]>([]);
    const [openCollaboratorsDialog2, setOpenCollaboratorsDialog2] = useState(false);
    const [newCollaboratorId2, setNewCollaboratorId2] = useState("");


    const handleEditTask = async () => {
      const updatedTask = {
        sqlQuery: "UPDATE",
        Task_ID: selectedTaskId,  // El ID de la tarea seleccionada
        Title: title,              // El título actualizado
        Description: description,  // La descripción actualizada
        Start_Date: startDate.toISOString().split('T')[0],  // Fecha de inicio (en formato YYYY-MM-DD)
        End_Date: endDate.toISOString().split('T')[0],      // Fecha de finalización (en formato YYYY-MM-DD)
        Due_Date: endDate.toISOString().split('T')[0],      // Fecha de vencimiento (puedes ajustarlo si es necesario)
        Priority: priority,        // Prioridad actualizada
        Assigned_Points: assignedPoints, // Puntos asignados
      };
    
      try {
        const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });
    
        const result = await response.json();
    
        if (response.ok) {
          console.log('Tarea editada correctamente:', result);
          // Aquí puedes actualizar el estado global o el estado de tu aplicación
        } else {
          console.error('Error al editar la tarea:', result);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    
      setOpenEditDialog(false); // Cerrar el modal después de guardar
    };

    const fetchCollaborators2 = () => {
      fetch(`http://localhost:5000/api/v1/task/tasks/${selectedTaskId}/collaborators`)
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            setCollaborators2(data.data); // Guardamos los colaboradores en el estado
          } else {
            console.error("Error al obtener los colaboradores");
          }
        })
        .catch((error) => console.error("Error de red:", error));
    };
    
    const handleRemoveCollaborator2 = (userId: number) => {
      fetch(`http://localhost:5000/api/v1/task/tasks/${selectedTaskId}/collaborators/${userId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            // Volvemos a obtener la lista de colaboradores para actualizarla
            fetchCollaborators2();
          } else {
            console.error("Error al eliminar colaborador");
          }
        })
        .catch((error) => console.error("Error de red:", error));
    };

    const [newCollaboratorId, setNewCollaboratorId] = useState("");

const handleAddCollaborator2 = () => {
  if (!newCollaboratorId) {
    console.error("ID del colaborador vacío");
    return;
  }

  fetch(`http://localhost:5000/api/v1/task/tasks/${selectedTaskId}/collaborators/${newCollaboratorId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        // Volvemos a obtener la lista de colaboradores para actualizarla
        fetchCollaborators2();
        setNewCollaboratorId(""); // Limpiamos el campo de ID
      } else {
        console.error("Error al agregar colaborador");
      }
    })
    .catch((error) => console.error("Error de red:", error));
};

    
    /////////////////////////////////////////////////// PARA LA EDICION DE PUNTOS DE LAS TAREAS ///////////////////////////////////
    const [remainingPoints, setRemainingPoints] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
      const storedUserId = localStorage.getItem('userId');
      
      console.log('User ID:', storedUserId); // Este será un string o null
    
      setUserId(storedUserId);
    
      if (storedUserId) {
        fetchTasks(storedUserId);  // No es necesario convertirlo a número
      }
    }, []);

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [task, setTask] = useState<Task | null>(null);
    const [completedPoints, setCompletedPoints] = useState<number>(0);
  
    const handleSliderChange = (_: Event, newValue: number | number[]) => {
      setCompletedPoints(newValue as number); // Aseguramos que newValue sea un número
    };
  
    const handleProgressDialogToggle = (task: Task) => {
      console.log("Tarea seleccionada:", task); // Verifica que el objeto task se pasa correctamente
      setTask(task); // Establecer la tarea seleccionada
      setOpenDialog(true); // Abrir el modal
      console.log("Estado de openDialog: ", openDialog); // Verifica si el estado está cambiando correctamente
    };
    
    const closeDialog = () => {
      setOpenDialog(false); // Cerrar el modal
    };
  
const handleSaveProgress = async () => {
  if (!selectedTaskId || !userId) {
    console.error('Faltan datos para avanzar el progreso');
    return;
  }

  const payload = {
    taskId: selectedTaskId,
    userId: userId,
    pointsToAdvance: completedPoints,
  };

  try {
    const response = await fetch('http://localhost:5000/api/v1/task/tasks/advance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Error al avanzar puntos de la tarea');
    }

    const result = await response.json();
    console.log('Progreso actualizado:', result);

    // Actualiza la tarea después de guardar
    const updatedTotalCompleted = Total_Completed + completedPoints;
    setTotal_Completed(updatedTotalCompleted);
    setRemainingPoints(remainingPoints - completedPoints);

    closeDialog(); // Cierra el diálogo
  } catch (error) {
    console.error('Error al guardar el progreso:', error);
  }
};


////////////////////////PARA VER LA LISTA DE MIS COLABORADORES //////////////////////////////
const [collaboratorsProject, setCollaboratorsProject] = useState<CollaboratorProject[]>([]); // Estado para colaboradores del proyecto
const [openCollaboratorsDialogSeeAll, setOpenCollaboratorsDialogSeeAll] = useState<boolean>(false); // Estado para el diálogo


const fetchCollaboratorsNuevo = () => {
  const storedProjectId = localStorage.getItem("projectId");

  console.log("Project ID obtenido de localStorage:", storedProjectId); // Verifica si el ID se está obteniendo correctamente

  if (!storedProjectId) {
    console.error("No se puede obtener colaboradores sin un ID de proyecto.");
    return;
  }

  fetch(`http://localhost:5000/api/v1/project/${storedProjectId}/collaborators`)
    .then((response) => {
      console.log("Respuesta del servidor:", response); // Verifica la respuesta del servidor
      return response.json();
    })
    .then((data) => {
      console.log("Datos obtenidos:", data); // Muestra los datos obtenidos

      if (data.ok) {
        console.log("Colaboradores del proyecto:", data.data); // Verifica los datos de los colaboradores
        setCollaboratorsProject(data.data);
      } else {
        console.error("Error en la respuesta del servidor:", data);
      }
    })
    .catch((error) => {
      console.error("Error de red:", error); // Captura errores de red
    });
};


const handleCollaboratorsDialogToggleSeeAll = () => {
  console.log("Abriendo el diálogo y llamando a fetchCollaboratorsNuevo...");
  setOpenCollaboratorsDialogSeeAll(true); // Abre el diálogo
  fetchCollaboratorsNuevo(); // Obtiene la lista de colaboradores
};

useEffect(() => {
  // Llamar a la función para cargar colaboradores al montar el componente
  fetchCollaboratorsNuevo();
}, []); // El array vacío asegura que solo se ejecute una vez, cuando el componente se monte

/////////////////////////////////// PARA LA MUESTRA DE DETAILLS /////////////////////////
const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, taskId: string, taskDescription: string) => {
  setAnchorEl(event.currentTarget);
  setSelectedTaskId(taskId as any); // Forzamos el tipo para evitar el error PERO NO ES RECOMENDABLE
  setDescription(taskDescription || "Sin descripción disponible.");
};

const handlePopoverClose = () => {
  setAnchorEl(null);
  setSelectedTaskId(null);
  setDescription("");
};

const isOpen = Boolean(anchorEl);



////////////////////////////////////PARA LA ELIMINACION DE TAREA POR ID ///////////////////////////

const handleDeleteTask = (taskId: number) => {
  const sqlQuery = {
    sqlQuery: "DELETE",
    Task_ID: taskId,
  };

  // Hacer la solicitud POST a la API para eliminar la tarea
  fetch("http://localhost:5000/api/v1/task/task/operation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sqlQuery),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        console.log(`Tarea con ID ${taskId} eliminada exitosamente.`);
        // Aquí actualizas el estado de las tareas eliminando la tarea con el ID correspondiente.
        setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== taskId));
      } else {
        console.error("Error al eliminar la tarea:", data);
      }
    })
    .catch((error) => {
      console.error("Error de red:", error);
    });
};


  return (
    <Box
      padding={4}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        paddingRight: 3,
        paddingLeft: 3,
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
          backgroundImage: 'url(https://w.wallhaven.cc/full/we/wallhaven-we9kw6.jpg)', // Imagen de fondo
          backgroundSize: backgroundSize,
          backgroundPosition: 'center',
          filter: 'opacity(0.5)',
          zIndex: -1,
        }}
      />
  
      {/* Contenido dividido */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '90vh', // Asegura que el contenedor principal ocupe toda la pantalla
          overflow: 'hidden', // Evita el desplazamiento del contenedor principal
        }}
      >
        {/* Sección de gráficos */}
        <Box
          sx={{
            width: '20%',
            borderRight: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: '100%', // Asegura que esta sección ocupe el 100% de la altura
            overflow: 'hidden',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Gráficas
          </Typography>
          
          {/* Contenedor scrollable */}
          <Box
            sx={{
              overflowY: 'auto', // Habilita el desplazamiento solo vertical
              flex: 1,
              paddingRight: 2,
              '&::-webkit-scrollbar': {
                width: '8px', // Ajusta el ancho de la barra de desplazamiento
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Color con transparencia para el pulgar
                borderRadius: '4px', // Bordes redondeados
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Color más oscuro al pasar el cursor
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Fondo del track con transparencia
              },
            }}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <Box key={i} sx={{ marginBottom: 2 }}>
                <Typography variant="body1">Gráfico {i + 1}</Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 150,
                    backgroundColor: '#00000066',
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                ></Box>
              </Box>
            ))}
          </Box>
        </Box>
  
        {/* Sección principal */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#00000055',
            borderRadius: 5,
            padding: 1,
            height: '100%', // Ocupa toda la altura
            overflow: 'hidden', // Evita que el contenedor principal tenga desplazamiento
          }}
        >
          {/* Encabezado y configuraciones */}
          <Box sx={{ padding: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            {/* Título */}
            <Typography variant="h4" gutterBottom>
              Gestión de Tareas
            </Typography>
  
            {/* Opciones de Configuración */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                marginBottom: 3,
                opacity: 0.9,
              }}
            >
              {/* Select para Ordenar */}
              <FormControl sx={{ width: '200px' }}>
                <InputLabel>Ordenar por</InputLabel>
                <Select defaultValue="recent" label="Ordenar por">
                  <MenuItem value="recent">Más Recientes</MenuItem>
                  <MenuItem value="name">Por Nombre</MenuItem>
                  <MenuItem value="priority">Más Importantes</MenuItem>
                </Select>
              </FormControl>
  
              {/* Select para Fondo */}
              <FormControl sx={{ width: '200px' }}>
                <InputLabel>Fondo</InputLabel>
                <Select
                  value={backgroundSize}
                  onChange={(e) => setBackgroundSize(e.target.value as "contain" | "auto" | "cover")}
                  label="Fondo"
                >
                  <MenuItem value="cover">Cubrir</MenuItem>
                  <MenuItem value="contain">Ajustar</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>
  
              {/* Botones de Acción */}
              <Box display="flex" alignItems="center">
                {/* Botón para Añadir Tarea */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTaskDialogToggle}
                  sx={{ marginRight: 2 }}
                >
                  Añadir Tarea
                </Button>
                {/* Modal para crear tarea */}
                <Dialog
  open={openTaskDialog}
  onClose={handleTaskDialogToggle}
  sx={{
    '& .MuiDialog-paper': {
      width: '80%', // Este es el ancho que se ajusta al 80% de la pantalla
      maxWidth: '800px', // Esto es el ancho máximo para evitar que se haga demasiado grande
    },
  }}
>
  <DialogTitle>Añadir Nueva Tarea</DialogTitle>

  <DialogContent>
    {/* Caja principal que contiene todo */}
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Layout en columna para el contenedor principal
        gap: 3, // Espacio entre los elementos
        width: '100%',
      }}
    >
      {/* Caja principal con la información de la tarea */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          gap: 3, // Espacio entre las cajas internas
        }}
      >
        {/* Caja izquierda - Información general de la tarea */}
        <Box sx={{ width: '48%' }}>
          <TextField
            fullWidth
            label="Título"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Descripción"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Prioridad</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Prioridad"
            >
              <MenuItem value="HIGH">Alta</MenuItem>
              <MenuItem value="MEDIUM">Media</MenuItem>
              <MenuItem value="LOW">Baja</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Puntos Asignados"
            variant="outlined"
            type="number"
            value={assignedPoints}
            onChange={(e) => setAssignedPoints(Number(e.target.value))}
            sx={{ marginBottom: 2 }}
          />
        </Box>

        {/* Caja derecha - Calendario y asignación de colaborador */}
        <Box sx={{ width: '48%' }}>
          {/* Selector de fecha */}
          <Box display="flex" justifyContent="center" width="100%" marginTop={2}>
            <DateRange
              editableDateInputs={true}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              minDate={new Date()}
              locale={enGB} // Configuración regional
              rangeColors={['#FF4081']}
            />
          </Box>

          {/* Selector de colaborador */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Asignar Colaborador</InputLabel>
            <Select
              value={assignedUserId !== null ? assignedUserId.toString() : ''}
              onChange={(e) => {
                const value = e.target.value;
                const newAssignedUserId = value === '' ? null : parseInt(value, 10);
                setAssignedUserId(newAssignedUserId); // Asignar el valor a assignedUserId
              }}
              label="Asignar Colaborador"
            >
              <MenuItem value="">
                <em>Sin asignar</em> {/* Opción para no asignar un colaborador */}
              </MenuItem>
              {collaborators.map((collaborator: any) => (
                <MenuItem key={collaborator.user_id} value={collaborator.user_id.toString()}>
                  <Box display="flex" alignItems="center">
                    <Avatar src={collaborator.image_url} sx={{ marginRight: 1 }} />
                    <Box>
                      <Typography variant="body1">{collaborator.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{collaborator.email}</Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  </DialogContent>

  {/* Botones de acción: Cancelar y Guardar Tarea */}
  <DialogActions>
    <Button onClick={handleTaskDialogToggle} color="secondary">
      Cancelar
    </Button>
    <Button onClick={handleSaveTask} color="primary">
      Guardar Tarea
    </Button>
  </DialogActions>
</Dialog>

  
    {/* Grupo de Avatares como Botón */}
    <Box
    sx={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer", // Cursor interactivo
      "&:hover": {
        opacity: 0.8,
      },
    }}
    onClick={() => {
      console.log("Se hizo clic en el grupo de avatares");
      handleCollaboratorsDialogToggleSeeAll();
    }}
  >
    {collaboratorsProject.length === 0 ? (
      <Typography variant="body1">Cargando colaboradores...</Typography>
    ) : (
      <AvatarGroup max={4}>
        {collaboratorsProject.slice(0, 4).map((collaborator) => {
          return (
            <Avatar
              key={collaborator.user_id}
              alt={collaborator.name}
              src={collaborator.image_url}
            />
          );
        })}
      </AvatarGroup>
    )}
  </Box>

    {/* Dialogo de colaboradores */}
    <Dialog
      open={openCollaboratorsDialogSeeAll}
      onClose={() => {
        console.log("Cerrando el diálogo");
        setOpenCollaboratorsDialogSeeAll(false);
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Colaboradores</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {collaboratorsProject.map((collaborator) => {
            console.log("Renderizando colaborador en el diálogo:", collaborator);
            return (
              <Box
                key={collaborator.user_id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  width: 150,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Avatar
                  src={collaborator.image_url}
                  alt={collaborator.name}
                  sx={{ width: 56, height: 56, marginBottom: 1 }}
                />
                <Typography variant="body1">{collaborator.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {collaborator.email}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Código: {collaborator.unique_code?.trim() || "N/A"}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            console.log("Cerrando el diálogo con el botón de acción");
            setOpenCollaboratorsDialogSeeAll(false);
          }}
          color="primary"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>



                

              </Box>
            </Box>
          </Box>
  
          {/* Contenedor scrollable de tareas */}
          <Box
            sx={{
              overflowY: 'auto', // Habilita el desplazamiento independiente
              flex: 1,
              padding: 2,
              '&::-webkit-scrollbar': {
                width: '8px', // Ancho de la barra de desplazamiento
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Transparencia del pulgar
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Más oscuro al pasar el cursor
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Fondo del track con transparencia
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Fecha Inicio</TableCell>
                  <TableCell>Fecha Límite</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Puntos</TableCell>
                  <TableCell>Prioridad</TableCell>
                  <TableCell>%</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {tasks.map((task: any) => (
                <TableRow key={task.task_id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.startDate.toLocaleDateString()}</TableCell>
                  <TableCell>{task.endDate?.toLocaleDateString() ?? 'No definido'}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={task.status === 'COMPLETED' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>{task.assigned_points}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.Completion_Percentage}%</TableCell>
                  <TableCell>
                  <Button 
                    onClick={() => {
                      setSelectedTaskId(task.task_id); 
                      setTaskData(task); // Aquí almacenamos la tarea seleccionada
                      setTitle(task.title); // Llenamos los campos con la información de la tarea
                      setDescription(task.description || ''); 
                      setStartDate(new Date(task.startDate));
                      setEndDate(new Date(task.endDate || new Date()));
                      setPriority(task.priority || 'HIGH');
                      setAssignedPoints(task.assigned_points || 0);
                      setCollaborators(task.collaborators || []);
                      setOpenEditDialog(true); // Abrir el modal
                    }} 
                    color="primary"
                  >
                    Editar
                  </Button>
                  {/* Modal para los datos de edit */}
                  <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
  <DialogTitle>Editar Tarea</DialogTitle>
  <DialogContent>
    <form>
      <TextField
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      
      {/* Reemplazamos el campo de fechas con el DateRange */}
      <Box display="flex" justifyContent="center" width="100%" marginTop={2}>
        <DateRange
          editableDateInputs={true}
          onChange={handleDateChange}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          minDate={new Date()}
          locale={enGB}
          rangeColors={['#FF4081']}
        />
      </Box>

      <TextField
        label="Puntos asignados"
        value={assignedPoints}
        onChange={(e) => setAssignedPoints(Number(e.target.value))}
        fullWidth
        margin="normal"
        type="number"
      />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Prioridad</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Prioridad"
            >
              <MenuItem value="HIGH">Alta</MenuItem>
              <MenuItem value="MEDIUM">Media</MenuItem>
              <MenuItem value="LOW">Baja</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={() => {
              fetchCollaborators2(); // Obtener colaboradores de la tarea
              setOpenCollaboratorsDialog(true); // Abrir el modal
            }}
            color="primary"
          >
            Ver Colaboradores
          </Button>

          <Dialog open={openCollaboratorsDialog} onClose={() => setOpenCollaboratorsDialog(false)}>
  <DialogTitle>Colaboradores</DialogTitle>
  <DialogContent>
    <div>
      {collaborators2.map((collaborator2) => (
        <Box key={collaborator2.user_id} display="flex" alignItems="center" marginBottom={2}>
          <img
            src={collaborator2.image_url}
            alt={collaborator2.name}
            style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
          />
          <Typography variant="body1" style={{ flex: 1 }}>
            {collaborator2.name}
          </Typography>
          <Button
            onClick={() => handleRemoveCollaborator2(collaborator2.user_id)}
            color="secondary"
            size="small"
          >
            Eliminar
          </Button>
        </Box>
      ))}
    </div>

    {/* Opción para agregar colaboradores */}
    <TextField
  label="ID del colaborador"
  value={newCollaboratorId}
  onChange={(e) => setNewCollaboratorId(e.target.value)}  // Cambié setNewCollaboratorId2 por setNewCollaboratorId
  fullWidth
  margin="normal"
  type="number"
/>
    <Button onClick={handleAddCollaborator2} color="primary">
      Agregar Colaborador
    </Button>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenCollaboratorsDialog(false)} color="primary">
      Cerrar
    </Button>
  </DialogActions>
</Dialog>


    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenEditDialog(false)} color="primary">
      Cancelar
    </Button>
    <Button
      onClick={() => {
        // Aquí procesas la tarea editada y haces la llamada al backend
        handleEditTask();
        setOpenEditDialog(false);
      }}
      color="primary"
    >
      Guardar
    </Button>
  </DialogActions>
</Dialog>



<Button
  onClick={() => {
    setSelectedTaskId(task.task_id); 
    setTask(task); // Almacena la tarea seleccionada
    setAssignedPoints(task.assigned_points || 0);
    setTotal_Completed(task.Total_Completed || 0);
    setRemainingPoints((task.assigned_points || 0) - (task.Total_Completed || 0));
    setCompletedPoints(0); // Resetea los puntos a avanzar
    setOpenDialog(true); // Abre el diálogo
  }}
  color="secondary"
>
  Progreso
</Button>



<Dialog open={openDialog} onClose={closeDialog}>
  <DialogTitle>Progreso de la tarea</DialogTitle>
  <DialogContent>
    <Typography variant="body1">
      Puntos asignados: {assignedPoints}
    </Typography>
    <Typography variant="body1">
      Puntos completados: {Total_Completed}
    </Typography>
    <Typography variant="body1">
      Puntos restantes: {remainingPoints}
    </Typography>
    <Box marginTop={2}>
      <Slider
        value={completedPoints}
        onChange={handleSliderChange}
        min={0}
        max={remainingPoints} // Límite según puntos restantes
        step={1}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}/${remainingPoints}`}
      />
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeDialog} color="primary">
      Cancelar
    </Button>
    <Button onClick={handleSaveProgress} color="primary">
      {completedPoints === remainingPoints ? 'Completar' : 'Guardar'}
    </Button>
  </DialogActions>
</Dialog>



                    {/* Botón para mostrar detalles con Popover */}
                    <Button
                      onClick={(event) => handlePopoverOpen(event, task.task_id, task.description || "")}
                      color="secondary"
                    >
                      Det.
                    </Button>
                    <Button
              onClick={() => handleDeleteTask(task.task_id)}
              color="error"  // Solo el texto será rojo
              variant="text"//"outlined"  // Fondo transparente
              size="small"  // Tamaño pequeño
              sx={{
                fontWeight: 'bold',  // Texto en negrita
                //borderColor: '#d32f2f',  // Bordes de color rojo
                color: '#d32f2f',  // Texto rojo
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',  // Fondo suave de color rojo al hacer hover
                  //borderColor: '#d32f2f',  // Mantener el borde rojo al hacer hover
                  transform: 'scale(1.05)',  // Efecto de escala al pasar el mouse
                },
                transition: 'all 0.3s ease',  // Suaviza la transición al hacer hover
              }}
            >
              Eliminar
            </Button>
                  </TableCell>
                    {/* Popover para mostrar detalles de la tarea */}
  <Popover
    open={isOpen}
    anchorEl={anchorEl}
    onClose={handlePopoverClose}
    anchorOrigin={{
      vertical: "center",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "center",
      horizontal: "right",
    }}
  >
    <Box sx={{ p: 2, maxWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Detalles de la Tarea
      </Typography>
      <Typography variant="body1">
        <strong>ID:</strong> {selectedTaskId}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <strong>Descripción:</strong> {description}
      </Typography>
    </Box>
  </Popover>
                </TableRow>

                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Box>
  );  
};

export default TaskManagement;
