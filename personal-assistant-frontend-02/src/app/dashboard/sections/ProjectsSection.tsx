import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Modal, TextField, Grid } from '@mui/material';
import { Project } from './types'; // Asume que tienes una interfaz 'Project' en algún lugar

interface getData {
  userData: {
    token: string | null;
    username: string | null;
    id: string | null;
  };
}

const ProjectsSection: React.FC<getData> = ({ userData }) => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    console.log('Ejecutando useEffect...');
    console.log('userData:', userData);
  
    const fetchProjects = async () => {
      if (!userData?.id) {
        console.error('El ID del usuario no está disponible.');
        setError('El ID del usuario no está disponible.');
        setLoading(false);
        return;
      }
  
      try {
        console.log('Realizando solicitud a la API con User_ID:', userData.id);
  
        const response = await fetch('http://localhost:5000/api/v1/project/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sqlQuery: 'SELECT', User_ID: userData.id }),
        });
  
        console.log('Respuesta de la API recibida:', response);
  
        const data = await response.json();
        console.log('Datos recibidos de la API:', data);
  
        if (data.ok) {
          setProjects(data.data);
        } else {
          console.error('Error desde el backend:', data.message);
          setError('No se pudieron obtener los proyectos.');
        }
      } catch (err) {
        console.error('Error al realizar la solicitud:', err);
        setError('Ocurrió un error al cargar los proyectos.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjects();
  }, [userData]);

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
    const response = await fetch('http://localhost:5000/api/v1/project/operation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sqlQuery: 'UPDATE',
        Project_ID: selectedProjectId,
        Name: projectName,
        Start_Date: startDate,
        End_Date: endDate,
      }),
    });
    if (response.ok) {
      const updatedProjects = projects.map(project =>
        project.project_id === selectedProjectId
          ? { ...project, name: projectName, start_date: startDate, end_date: endDate }
          : project
      );
      setProjects(updatedProjects);
      setOpenEditModal(false);
    }
  };

  const handleEditClick = (projectId: number, name: string, start_date: string, end_date: string) => {
    setSelectedProjectId(projectId);
    setProjectName(name);
    setStartDate(start_date);
    setEndDate(end_date);
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <Typography>Cargando proyectos...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Proyectos
      </Typography>

      {/* Lista de Proyectos */}
      <Grid container spacing={2}>
        {projects.map(project => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={project.project_id}
            onClick={() => {
              if (!userData || !userData.id) {
                console.error('userData no está definido o falta el ID del usuario:', userData);
                return; // Detén la ejecución si `userData` no es válido
              }
          
              console.log('Almacenando datos en localStorage:', {
                projectId: project.project_id,
                userId: userData.id,
              });
          
              localStorage.setItem('projectId', project.project_id.toString());
              localStorage.setItem('userId', userData.id);
              router.push('/EviromentTasks'); // Redirigir a la nueva página
            }}
            sx={{ cursor: 'pointer' }}
          >
        
            <Box
              border={1}
              borderRadius={2}
              p={2}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="200px"
            >
              <Typography variant="h6">{project.name}</Typography>
              <Typography variant="body2">Inicio: {new Date(project.start_date).toLocaleDateString()}</Typography>
              <Typography variant="body2">Fin: {new Date(project.end_date).toLocaleDateString()}</Typography>

              <Box display="flex" justifyContent="space-between" marginTop={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    handleEditClick(project.project_id, project.name, project.start_date, project.end_date);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(project.project_id);
                  }}
                >
                  Eliminar
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal para Editar Proyecto */}
      <Modal open={openEditModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Editar Proyecto</Typography>
          <TextField
            label="Nombre del Proyecto"
            fullWidth
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Fecha de Inicio"
            type="date"
            fullWidth
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }} // No permite fechas antes de hoy
          />
          <TextField
            label="Fecha de Fin"
            type="date"
            fullWidth
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: startDate || today }} // No permite fechas antes de la de inicio o hoy
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Actualizar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectsSection;





