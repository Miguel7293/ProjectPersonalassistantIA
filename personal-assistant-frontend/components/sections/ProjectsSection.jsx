import React, { useEffect, useState } from 'react';
import styles from '../../styles/ProjectsSection.module.css';
import AddProjectModal from './AddProjectModal';
import EditProjectModal from './EditProjectModal';
import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';

const ProjectsSection = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/v1/project/operation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sqlQuery: 'SELECT',
                        User_ID: 1,
                    }),
                });

                const data = await response.json();
                if (data.ok) {
                    setProjects(data.data);
                } else {
                    setError('No se pudieron obtener los proyectos.');
                }
            } catch (err) {
                setError(`Error al obtener los proyectos: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const fetchTasks = async (projectId) => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/task/task/operation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sqlQuery: 'SELECT',
                    Project_ID: projectId,
                }),
            });

            const data = await response.json();
            if (data.ok) {
                setTasks(data.data);
            } else {
                setError('No se pudieron obtener las tareas.');
            }
        } catch (err) {
            setError(`Error al obtener las tareas: ${err.message}`);
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    if (loading) return <p className={styles.loading}>Cargando proyectos...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.projectsContainer}>
            <h1 className={styles.title}>Projects</h1>

            {/* Lista de Proyectos */}
            {!selectedProjectId && !selectedTask && (
                <>
                    <ul className={styles.projectList}>
                        {projects.map((project) => (
                            <li
                                key={project.project_id}
                                className={styles.projectItem}
                                onClick={() => {
                                    setSelectedProjectId(project.project_id);
                                    fetchTasks(project.project_id);
                                }}
                            >
                                <h2>{project.name}</h2>
                                <p>Inicio: {new Date(project.start_date).toLocaleDateString()}</p>
                                <p>Fin: {new Date(project.end_date).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsAddProjectOpen(true)}
                    >
                        + Añadir Proyecto
                    </button>
                </>
            )}

            {/* Lista de Tareas */}
            {selectedProjectId && !selectedTask && (
                <>
                    <div className={styles.tasksContainer}>
                        <button
                            className={styles.backButton}
                            onClick={() => {
                                setSelectedProjectId(null);
                                setTasks([]);
                            }}
                        >
                            ← Volver a Proyectos
                        </button>
                        <h2>Tareas del Proyecto</h2>
                        <ul className={styles.taskList}>
                            {tasks.map((task) => (
                                <li
                                    key={task.task_id}
                                    className={styles.taskItem}
                                    onClick={() => handleTaskClick(task)}
                                >
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                    <p>Vence: {new Date(task.due_date).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                        <button
                            className={styles.editButton}
                            onClick={() => setIsEditProjectOpen(true)}
                        >
                            Editar Proyecto
                        </button>
                        <button
                            className={styles.addButton}
                            onClick={() => setIsAddTaskOpen(true)}
                        >
                            + Añadir Tarea
                        </button>
                    </div>
                </>
            )}

            {/* Detalles de Tarea */}
            {selectedTask && (
                <div className={styles.taskDetailsContainer}>
                    <button
                        className={styles.backButton}
                        onClick={() => setSelectedTask(null)}
                    >
                        ← Volver a Tareas
                    </button>
                    <h2>Detalles de la Tarea</h2>
                    <p><strong>Título:</strong> {selectedTask.title}</p>
                    <p><strong>Descripción:</strong> {selectedTask.description}</p>
                    <p><strong>Fecha de Vencimiento:</strong> {new Date(selectedTask.due_date).toLocaleDateString()}</p>
                    <button
                        className={styles.editButton}
                        onClick={() => setIsEditTaskOpen(true)}
                    >
                        Editar Tarea
                    </button>
                </div>
            )}

            {/* Modales */}
            {isAddProjectOpen && <AddProjectModal onClose={() => setIsAddProjectOpen(false)} />}
            {isEditProjectOpen && (
                <EditProjectModal
                    projectId={selectedProjectId}
                    onClose={() => setIsEditProjectOpen(false)}
                />
            )}
            {isAddTaskOpen && (
                <AddTaskModal
                    projectId={selectedProjectId}
                    onClose={() => setIsAddTaskOpen(false)}
                />
            )}
            {isEditTaskOpen && (
                <EditTaskModal
                    task={selectedTask}
                    onClose={() => setIsEditTaskOpen(false)}
                />
            )}
        </div>
    );
};

export default ProjectsSection;
