export interface Task {
    projectId: number; // ID del proyecto asociado
    title: string; // Título de la tarea
    description?: string; // Descripción (opcional)
    startDate: Date; // Fecha de inicio
    endDate?: Date; // Fecha límite (opcional)
    dueDate?: Date; // Fecha de vencimiento (opcional)
    status: 'PROGRESS' | 'COMPLETED' | 'NOT COMPLETED' | 'NOT STARTED' | 'NOT ASSIGNED'; // Estado
    priority: 'LOW' | 'MEDIUM' | 'HIGH'; // Prioridad
    assignedPoints: number; // Puntos asignados
  }

  
  // Tipo para un colaborador
export interface Collaborator {
  name: string; // Nombre del colaborador
  code: string; // Código único del colaborador
  email: string; // Correo electrónico del colaborador
  completed: number; // Número de tareas completadas
  pending: number; // Número de tareas pendientes
}


export interface Collaborator2 {
  user_id: number;
  name: string;
  email: string;
  image_url: string;
  completed: boolean;
}


export interface CollaboratorProject {
  user_id: number;
  name: string;
  email: string;
  image_url: string;
  unique_code: string;
}
