'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Modal, TextField, Grid } from '@mui/material';
import { Project } from './types';

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
    <Box bgcolor="#121212" p={4} color="#E0E0E0">
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
              if (!userData?.id) return;
              localStorage.setItem('projectId', project.project_id.toString());
              localStorage.setItem('userId', userData.id);
              router.push('/EviromentTasks');
            }}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.4)',
              },
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
            >
              {/* Imagen del proyecto */}
              <Box
                component="img"
                src={project.image_url || 'https://th.bing.com/th/id/R.63e1f5195771ebfe18376719aed0ad65?rik=9Qyq3JA%2bMCkiag&pid=ImgRaw&r=0'} // URL de imagen
                alt={project.name}
                sx={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
              <Typography variant="h6" color="#FFF" mt={2}>
                {project.name}
              </Typography>
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
            bgcolor: '#333',
            color: '#FFF',
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
            inputProps={{ min: today }}
          />
          <TextField
            label="Fecha de Fin"
            type="date"
            fullWidth
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: startDate || today }}
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
