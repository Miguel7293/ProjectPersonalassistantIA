'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Modal, TextField, Grid , Grid2} from '@mui/material';
import { Project } from './types';
import { Collaborator } from './types';


import { DateRange } from 'react-date-range';
import { enGB } from 'date-fns/locale'; // Cambia a `es` si prefieres en español.
import 'react-date-range/dist/styles.css'; // Estilos base
import 'react-date-range/dist/theme/default.css'; // Tema predeterminad
import 'react-datepicker/dist/react-datepicker.css';

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'; // Importar componentes necesarios
import { SelectChangeEvent } from "@mui/material";

import { Card, CardContent } from '@mui/material'; // Para los graphics
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


interface GetData {
  userData: {
    token: string | null;
    username: string | null;
    id: string | null;
  };
}

const ProjectsSection: React.FC<GetData> = ({ userData }) => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');




  // Campos del formulario
  const [maxPoints, setMaxPoints] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });


  const [isImageValid, setIsImageValid] = useState(true); // Para manejar la validación de la imagen

  const [sortOption, setSortOption] = useState<string>('alphabetical'); // Estado para la opción de ordenamiento

  const [openCollaboratorsModal, setOpenCollaboratorsModal] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorCode, setNewCollaboratorCode] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false); // Estado para cargar colaboradores


  const [flippedProject, setFlippedProject] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userData?.id) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userData?.id]);

  const sortProjects = (option: string) => {
    let sortedProjects = [...projects];

    switch (option) {
      case 'alphabetical':
        sortedProjects.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'urgency':
        sortedProjects.sort(
          (a, b) => calculateDaysLeft(a.end_date) - calculateDaysLeft(b.end_date)
        );
        break;
      case 'oldest':
        sortedProjects.sort((a, b) => a.project_id - b.project_id);

        break;
      case 'newest':
        sortedProjects.sort((a, b) => b.project_id - a.project_id);

        break;
      default:
        break;
    }

    setProjects(sortedProjects);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const selectedOption = event.target.value as string;
    setSortOption(selectedOption);
    sortProjects(selectedOption);
  };



  const handleDelete = async (projectId: number) => {
    const response = await fetch('http://localhost:5000/api/v1/project/operation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sqlQuery: 'DELETE',
        Project_ID: projectId,
      }),
    });
    if (response.ok) {
      setProjects(projects.filter(project => project.project_id !== projectId));
    }
  };


  const handleUpdate = async () => {
    // Primero, validamos la URL antes de hacer la solicitud
    if (!isImageValid || imageUrl === "Predeterminado") {
      setImageUrl("Predeterminado");
    }
  
    // Ahora que la URL está lista, realizamos la solicitud de actualización
    const response = await fetch('http://localhost:5000/api/v1/project/operation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sqlQuery: 'UPDATE',
        Project_ID: selectedProjectId,
        Name: projectName,
        Start_Date: dateRange.startDate.toISOString().split('T')[0],
        End_Date: dateRange.endDate.toISOString().split('T')[0],
        Max_Points: maxPoints,
        Image_URL: imageUrl,
      }),
    });
  
    if (response.ok) {
      const updatedProjects = projects.map(project =>
        project.project_id === selectedProjectId
          ? {
              ...project,
              name: projectName,
              start_date: dateRange.startDate.toISOString(),
              end_date: dateRange.endDate.toISOString(),
              max_points: maxPoints === "" ? 0 : Number(maxPoints), // Aseguramos que maxPoints sea un número
              image_url: imageUrl,
            }
          : project
      );
      setProjects(updatedProjects);
      setOpenEditModal(false);
    } else {
      // Manejar el error de la solicitud, si lo hay
      console.error("Error al actualizar el proyecto");
    }
  };
  

  const handleEditClick = (projectId: number, name: string, start_date: string, end_date: string, max_points: number,   image_url: string ) => {
    setSelectedProjectId(projectId);
    setProjectName(name);
    setStartDate(start_date);
    setEndDate(end_date);
    setOpenEditModal(true);
    setMaxPoints(max_points);
    setImageUrl(image_url);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
  };

  const today = new Date().toISOString().split('T')[0];

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir a días
    return diffDays > 0 ? diffDays : 0; // Si la fecha ya pasó, devolver 0
  };

  const validateImageUrl = async (url: string) => {
    // Verificar si la URL termina con una extensión de imagen válida
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const isValidExtension = validExtensions.some(ext => url.endsWith(ext));
    
    if (!isValidExtension) {
      setIsImageValid(true); // No es una imagen válida
      return;
    }

    // Verificar si la imagen es accesible a través de una solicitud HTTP
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        setIsImageValid(true); // Si la respuesta es ok, la imagen es válida
      } else {
        setIsImageValid(true); // Si no, la imagen no es válida
      }
    } catch (error) {
      setIsImageValid(false); // Si ocurre un error en la solicitud, consideramos que la imagen no es válida
    }
  };

  // Función para manejar la URL de la imagen
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url && url !== "Predeterminado") {
      validateImageUrl(url); // Solo validamos la imagen si no es "Predeterminado"
    }
  };

  const fetchCollaborators = async (projectId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/project/${projectId}/collaborators`);
      const data = await response.json();
  
      if (data.ok) {
        setCollaborators(data.data); // Actualiza los colaboradores con los nuevos datos
      }
    } catch (error) {
      console.error('Error obteniendo colaboradores:', error);
    } finally {
      setLoadingCollaborators(false); // Finaliza el estado de carga
    }
  };

  useEffect(() => {
    if (openCollaboratorsModal && selectedProjectId) {
      setLoadingCollaborators(true); // Inicia el estado de carga
      fetchCollaborators(selectedProjectId);
    }
  }, [openCollaboratorsModal, selectedProjectId]);
  

// Agregar colaborador
const handleAddCollaborator = async () => {
  if (!selectedProjectId) return; // Asegurarse de que haya un proyecto seleccionado

  try {
    const body = newCollaboratorEmail
      ? { email: newCollaboratorEmail }
      : { uniqueCode: newCollaboratorCode };

    const response = await fetch(
      `http://localhost:5000/api/v1/project/${selectedProjectId}/collaborators`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      await fetchCollaborators(selectedProjectId);
      setNewCollaboratorEmail('');
      setNewCollaboratorCode('');
    } else {
      console.error('Error agregando colaborador');
    }
  } catch (error) {
    console.error('Error en el POST:', error);
  }
};


const handleMouseEnter = (projectId: number) => {
  // Set a timer to flip the card after 3 seconds
  const timeout = setTimeout(() => {
    setFlippedProject(projectId);
  }, 3000);
  setHoverTimeout(timeout);
};

const handleMouseLeave = () => {
  // Clear the timeout and reset the flip state
  if (hoverTimeout) clearTimeout(hoverTimeout);
  setFlippedProject(null);
};


  return (
    <Box bgcolor="#121212" p={4} color="#E0E0E0">
      <Typography variant="h4" gutterBottom>
        Proyectos
      </Typography>

{/* Selector de ordenamiento */}
<FormControl 
  fullWidth
  variant="outlined"
  sx={{
    marginBottom: 1, // Reducir el espacio inferior
    backgroundColor: '#1f1f20',
    borderRadius: '8px',
  }}
>
  <InputLabel 
    id="sort-label" 
    style={{
      color: '#B0B0B0', 
      fontWeight: 500,
      paddingTop: 0, // Reducir el padding superior
      paddingBottom: 0, // Reducir el padding inferior
    }} 
  >
    Ordenar por
  </InputLabel>
  <Select
    labelId="sort-label"
    value={sortOption}
    onChange={handleSortChange}
    sx={{
      color: '#E0E0E0',
      backgroundColor: '#1f1f20',
      height: 40, // Reducir la altura del select
      padding: '0 10px', // Ajustar el padding horizontal
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1f1f20',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#738BC9',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#738BC9',
      },
      borderRadius: '8px',
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: '#000000',  // Color de fondo del menú de opciones
          borderRadius: '8px',
          marginTop: '5px',
          '& .MuiMenuItem-root': {
            fontSize: '14px',
            color: '#B0B0B0',  // Color del texto de las opciones
            '&:hover': {
              backgroundColor: '#313C55',  // Color de fondo al pasar el ratón por encima
            },
            '&.Mui-selected': {
              backgroundColor: '#202738',  // Color de fondo cuando la opción está seleccionada
              color: '#FFFFFF',  // Color del texto cuando está seleccionada
            },
          },
        },
      },
    }}
  >
    <MenuItem value="alphabetical">Alfabéticamente</MenuItem>
    <MenuItem value="urgency">Por urgencia</MenuItem>
    <MenuItem value="oldest">Más antiguos</MenuItem>
    <MenuItem value="newest">Recientes</MenuItem>
  </Select>
</FormControl>


      {/* Lista de Proyectos */}
      <Grid container spacing={2}>
  {projects.map(project => {
    const remainingDays = calculateDaysLeft(project.end_date);
    const remainingText = remainingDays > 0 ? `${remainingDays} días restantes` : 'Finalizado';

    return (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        key={project.project_id}
        onClick={() => {
          if (!userData?.id) return;
          localStorage.setItem('projectId', project.project_id.toString());
          localStorage.setItem('userId', userData.id.toString());
          localStorage.setItem('userRol', project.role.toString());

          router.push('/EviromentTasks');
        }}
        onMouseEnter={() => handleMouseEnter(project.project_id)}
        onMouseLeave={handleMouseLeave}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.4)',
          },
          perspective: '1000px',
        }}
      >
        <Box
          border={1}
          borderColor="#333"
          borderRadius={2}
          p={2}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="260px"
          bgcolor="#1E1E1E"
          sx={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s',
            ...(flippedProject === project.project_id && {
              transform: 'rotateY(180deg)',
            }),
          }}
        >
          {/* Cara frontal */}
          <Box sx={{ backfaceVisibility: 'hidden' }}>
            <Box component="img" src={project.image_url === 'Predeterminado' ? '/icon_2.png' : project.image_url} alt={project.name} sx={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: 2 }} />
            <Typography variant="h6" color="#FFF" mt={2}>{project.name}</Typography>
            <Typography variant="body2">Inicio: {new Date(project.start_date).toLocaleDateString()}</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">Fin: {new Date(project.end_date).toLocaleDateString()}</Typography>
              <Typography variant="body2" color={remainingDays > 7 ? '#38BAC0' : '#F52F53'}>{remainingText}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" marginTop={2}>
              {/* Verifica el rol para permitir editar o eliminar */}
              {project.role === 'ADMIN' && (
                <>
                  <Button variant="outlined" color="primary" size="small" onClick={e => { e.stopPropagation(); handleEditClick(project.project_id, project.name, project.start_date, project.end_date, project.max_points, project.image_url); }}>Editar</Button>
                  <Button variant="outlined" color="secondary" size="small" onClick={e => { e.stopPropagation(); handleDelete(project.project_id); }}>Eliminar</Button>
                </>
              )}
            </Box>
          </Box>

          {/* Cara posterior del proyecto (cuando se voltea) */}
          <Box
            sx={{
              backfaceVisibility: 'hidden', // Ocultar la parte posterior cuando se voltea
              transform: 'rotateY(180deg)', // Invertir el contenido
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#FFF',
              textAlign: 'center',
              padding: 2,
              height: '100%', // Asegura que la cara posterior ocupe el 100% del espacio
              position: 'absolute',
              top: 0, // Asegura que la parte posterior esté sobre la frontal
              left: 0, // Asegura que la parte posterior esté sobre la frontal
              width: '100%',
              borderRadius: 2,
              backgroundColor: '#1E1E1E',
            }}
          >
            {/* Eliminado el título para aprovechar más espacio */}
            <Box
              sx={{
                width: '100%', 
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Card sx={{ bgcolor: '#1E1E1E', color: '#E0E0E0', height: '100%', width: '100%' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
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
            </Box>
          </Box>
        </Box>
      </Grid>
    );
  })}
</Grid>

      {/* Modal para Editar Proyecto */}
      <Modal open={openEditModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800, // Aumento el tamaño del modal
            bgcolor: '#1f1f20BB', // COLOR BASE #1f1f20
            color: '#FFF',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {/* Caja general para los datos */}
          <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h6" mb={2}>
              Editar Proyecto
            </Typography>

            {/* Contenedor para las 2 columnas: izquierda con los campos y derecha con el calendario */}
            <Box display="flex" gap={3}>
              {/* Columna izquierda con los campos de texto */}
              <Box sx={{ width: '50%' }}>
                <TextField
                  label="Nombre del Proyecto"
                  fullWidth
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                
                <TextField
                  label="Puntos Máximos"
                  fullWidth
                  type="number"
                  value={maxPoints}
                  onChange={e => setMaxPoints(Number(e.target.value))}
                  sx={{ marginBottom: 2 }}
                />
                
                <TextField
                  label="URL de la Imagen"
                  fullWidth
                  value={imageUrl}
                  onChange={e => handleImageUrlChange(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />

                {/* Botón para marcar la URL como "Predeterminado" */}
                <Button
                  variant="outlined"
                  onClick={() => {
                    setImageUrl("Predeterminado");
                    setIsImageValid(true); // Cuando se marca como predeterminado, no hay validación
                  }}
                  sx={{ marginBottom: 2 }}
                >
                  Predeterminado
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenCollaboratorsModal(true)}
                  sx={{ marginBottom: 2, marginLeft: 1 }}
                >
                  Colaboradores
                </Button>


                {/* Si la URL no es válida, mostrar un mensaje de error */}
                {!isImageValid && imageUrl && imageUrl !== "Predeterminado" && (
                  <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                    La URL de la imagen no es válida. Intenta con otra URL.
                  </Typography>
                )}

                {/* Si hay una URL válida, mostrar vista previa de la imagen */}
                {isImageValid && imageUrl && imageUrl !== "Predeterminado" && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body2" color="#AAA" mb={1}>
                      Vista previa de la imagen:
                    </Typography>
                    <img 
                      src={imageUrl} 
                      alt="Vista previa" 
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                    />
                  </Box>
                )}
              </Box>

              {/* Columna derecha con el calendario */}
              <Box sx={{ width: '40%' }}>
                <Typography variant="body1" color="#AAA" mb={1} align="left">
                  Fechas del Proyecto:
                </Typography>
                <DateRange
                  ranges={[dateRange]}
                  onChange={item => setDateRange(item.selection)}
                  locale={enGB}
                  showMonthAndYearPickers
                  color="#38BAC0"
                  minDate={new Date()}  // Restricción para no seleccionar fechas anteriores a hoy
                />
              </Box>
            </Box>

            {/* Botones de Cancelar y Actualizar fuera de las cajas, al final */}
            <Box display="flex" justifyContent="space-between" marginTop={3}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Actualizar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

{/* Modal para Gestionar Colaboradores */}
<Modal open={openCollaboratorsModal} onClose={() => setOpenCollaboratorsModal(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: '#111111bb', // COLOR BASE
      color: '#FFF',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    <Typography variant="h6" mb={2}>
      Gestionar Colaboradores
    </Typography>

    {/* Lista de colaboradores */}
    <Box mb={3}>
    <Typography variant="body1" color="#AAA" mb={1}>
      Colaboradores actuales:
    </Typography>
    {loadingCollaborators ? (
      <Typography variant="body2" color="#AAA">
        Cargando...
      </Typography>
    ) : collaborators.length > 0 ? (
      collaborators.map((collab) => (
        <Box key={collab.email} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <img
            src={collab.image_url} // Asegúrate de que esta propiedad existe
            alt="Avatar"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
          <Typography variant="body2">{collab.email}</Typography>
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="#AAA">
        No hay colaboradores.
      </Typography>
    )}
  </Box>

    {/* Formulario para agregar colaboradores */}
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Correo del Colaborador"
        fullWidth
        value={newCollaboratorEmail}
        onChange={(e) => setNewCollaboratorEmail(e.target.value)}
      />
      <TextField
        label="Código único del Colaborador"
        fullWidth
        value={newCollaboratorCode}
        onChange={(e) => setNewCollaboratorCode(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCollaborator}
        disabled={!newCollaboratorEmail && !newCollaboratorCode}
      >
        Agregar Colaborador
      </Button>
    </Box>
  </Box>
</Modal>

      
    </Box>
  );
};

export default ProjectsSection;

