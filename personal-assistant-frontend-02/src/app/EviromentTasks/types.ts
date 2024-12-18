export interface Task {
  id: number; // ID único de la tarea (task_id)
  projectId: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  dueDate?: Date;
  status: 'PROGRESS' | 'COMPLETED' | 'NOT COMPLETED' | 'NOT STARTED' | 'NOT ASSIGNED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedPoints: number;
  role: string; // Rol asociado a la tarea
  editedPermitted: boolean; // Permite edición o no
  completionPercentage: number; // Porcentaje de completado
  totalCompleted: number; // Puntos completados en la tarea
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
