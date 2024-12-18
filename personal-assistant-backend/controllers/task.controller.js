import { TaskModel } from '../models/task.model.js';
import { db } from '../database/connection.database.js';  // Asegúrate de tener la conexión a la base de datos

const performOperation = async (req, res) => {
    try {
        const { 
            user_id,
            sqlQuery, 
            Task_ID, 
            Project_ID, 
            Title, 
            Description, 
            Start_Date, 
            End_Date, 
            Due_Date, 
            Status, 
            Priority, 
            Assigned_User_ID, // Asegúrate de incluir Assigned_User_ID en el destructuring
            Assigned_Points 
        } = req.body;

        if (!sqlQuery) {
            return res.status(400).json({ ok: false, msg: 'sqlQuery is required' });
        }

        // Validar y asegurar que las fechas están en el formato correcto
        const formatDate = (date) => {
            if (date) {
                const parsedDate = new Date(date);
                if (!isNaN(parsedDate)) {
                    return parsedDate.toISOString().slice(0, 19).replace('T', ' '); // Formato: 'YYYY-MM-DD HH:mm:ss'
                } else {
                    return null; // Si la fecha no es válida
                }
            }
            return null;
        };

        let result;
        switch (sqlQuery.toUpperCase()) {
            case 'INSERT':
                if (!Project_ID || !Title || !Start_Date) {
                    return res.status(400).json({ ok: false, msg: 'Missing required fields for INSERT' });
                }
            
                // Asignar un valor por defecto a Priority si no se pasa
                const taskPriority = Priority || 'LOW';
            
                const formattedStartDate = formatDate(Start_Date);
                const formattedEndDate = formatDate(End_Date);
                const formattedDueDate = formatDate(Due_Date);
                const taskAssignedPoints = Assigned_Points || 0;

                const statusTask = Priority || 'NOT STARTED';


            
                // Insertar la tarea
                result = await TaskModel.insert({
                    Project_ID,
                    Title,
                    Description,
                    Start_Date: formattedStartDate,
                    End_Date: formattedEndDate,
                    Due_Date: formattedDueDate,
                    Status: statusTask,
                    Priority: taskPriority,
                    Assigned_Points: taskAssignedPoints // Añadir puntos asignados
                });
            
                const taskID = result?.Task_ID || result?.task_id; // Asegurar compatibilidad
                console.log(`Task created with Task_ID: ${taskID}`);
            
                if (!taskID) {
                    console.error('Task creation failed, Task_ID is undefined.');
                    return res.status(500).json({ ok: false, msg: 'Task creation failed' });
                }
            
                // Verificar si Assigned_User_ID fue proporcionado
                let assignedUserID = Assigned_User_ID;
            
                if (!assignedUserID) {
                    const adminQuery = `SELECT User_ID FROM USER_PROJECT WHERE Project_ID = $1 AND Role = 'ADMIN' LIMIT 1`;
                    console.log('Executing admin query:', adminQuery, [Project_ID]);
            
                    const { rows: adminRows } = await db.query(adminQuery, [Project_ID]);
                    console.log('Admin User Query Result:', adminRows);
            
                    if (adminRows.length > 0) {
                        assignedUserID = adminRows[0]?.user_id; // Acceder a 'user_id' correctamente
                        console.log(`Assigned to ADMIN User_ID: ${assignedUserID}`);
                    } else {
                        console.log(`No ADMIN found for Project_ID: ${Project_ID}`);
                        
                        // Respaldo: Asignar la tarea al primer usuario del proyecto si no hay ADMIN
                        const fallbackQuery = `SELECT User_ID FROM USER_PROJECT WHERE Project_ID = $1 LIMIT 1`;
                        console.log('Executing fallback query:', fallbackQuery, [Project_ID]);
            
                        const { rows: fallbackRows } = await db.query(fallbackQuery, [Project_ID]);
                        console.log('Fallback User Query Result:', fallbackRows);
            
                        if (fallbackRows.length > 0) {
                            assignedUserID = fallbackRows[0]?.user_id; // Acceder a 'user_id' correctamente
                            console.log(`Fallback assigned to User_ID: ${assignedUserID}`);
                        }
                    }
                }
            
                if (assignedUserID) {
                    await db.query(
                        'INSERT INTO USER_TASK (User_ID, Task_ID) VALUES ($1, $2)',
                        [assignedUserID, taskID]
                    );
                    console.log(`Task successfully assigned to User_ID: ${assignedUserID}`);
                } else {
                    console.error('Task not assigned; no users available.');
                }
            
                break;
            

                case 'SELECT':
                    if (!Project_ID || !user_id) {
                        return res.status(400).json({ ok: false, msg: 'Project_ID and user_id are required for SELECT' });
                    }
                
                    try {
                        // Llamada a la función selectByProjectID con los dos parámetros
                        const result = await TaskModel.selectByProjectID(Project_ID, user_id);
                
                        // Verificamos si la respuesta es exitosa
                        if (result.ok) {
                            return res.status(200).json({ ok: true, tasks: result.tasks });
                        } else {
                            return res.status(400).json({ ok: false, msg: result.msg });
                        }
                    } catch (error) {
                        console.error('Error al ejecutar SELECT:', error);
                        return res.status(500).json({ ok: false, msg: 'Internal Server Error' });
                    }
                    break;
                

            case 'UPDATE':
                if (!Task_ID || !Title) {
                    return res.status(400).json({ ok: false, msg: 'Task_ID and Title are required for UPDATE' });
                }

                const updatedStartDate = formatDate(Start_Date);
                const updatedEndDate = formatDate(End_Date);
                const updatedDueDate = formatDate(Due_Date);
                const taskAssignedPoints2 = Assigned_Points || 0;


                result = await TaskModel.update({
                    Task_ID,
                    Title,
                    Description,
                    Start_Date: updatedStartDate,
                    End_Date: updatedEndDate,
                    Due_Date: updatedDueDate,
                    Priority,
                    Assigned_Points: taskAssignedPoints2
                });
                break;

            case 'DELETE':
                if (!Task_ID) {
                    return res.status(400).json({ ok: false, msg: 'Task_ID is required for DELETE' });
                }
                result = await TaskModel.deleteTask(Task_ID);
                break;

            default:
                return res.status(400).json({ ok: false, msg: 'Invalid sqlQuery' });
        }

        res.json({ ok: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Server error', error: error.message });
    }
};


const getCollaboratorsByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params; // Cambié esto a req.params ya que 'taskId' es un parámetro en la URL

        if (!taskId) {
            return res.status(400).json({ ok: false, msg: 'Task ID is required' });
        }

        const collaborators = await TaskModel.getCollaboratorsByTaskId(taskId); // Asegúrate de que el nombre de la función sea correcto

        return res.status(200).json({ ok: true, data: collaborators });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Server error', error: error.message });
    }
};

const removeCollaboratorFromTask = async (req, res) => {
    try {
        const { taskId, userId } = req.params;

        if (!taskId || !userId) {
            return res.status(400).json({ ok: false, msg: 'Both taskId and userId are required' });
        }

        // Llamada al modelo para eliminar el colaborador
        const result = await TaskModel.removeCollaboratorFromTask(taskId, userId); // Cambié el nombre de la función en el modelo

        if (!result) {
            return res.status(404).json({ ok: false, msg: 'Collaborator not found for this task' });
        }

        return res.status(200).json({ ok: true, msg: 'Collaborator removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Server error', error: error.message });
    }
};

const addCollaboratorToTask = async (req, res) => {
    try {
        const { taskId, userId } = req.params;
        if (!taskId || !userId) {
            return res.status(400).json({ ok: false, msg: 'Both taskId and userId are required' });
        }

        // Llamada al modelo para agregar el colaborador
        const result = await TaskModel.addCollaboratorToTask(taskId, userId); // Asegúrate de que el nombre de la función sea correcto

        return res.status(200).json({ ok: true, msg: 'Collaborator added successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Server error', error: error.message });
    }
};

const advanceTask = async (req, res) => {
    try {
        const { taskId, userId, pointsToAdvance } = req.body; // Se espera que los parámetros estén en el cuerpo de la solicitud

        if (!taskId || !userId || pointsToAdvance === undefined) {
            return res.status(400).json({ ok: false, msg: 'taskId, userId, and pointsToAdvance are required' });
        }

        // Llamada al modelo para avanzar la tarea
        const result = await TaskModel.advanceTask(taskId, userId, pointsToAdvance);

        return res.status(200).json({
            ok: true,
            msg: 'Task advanced successfully',
            data: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Server error',
            error: error.message,
        });
    }
};

export const TaskController = { performOperation, addCollaboratorToTask, removeCollaboratorFromTask, getCollaboratorsByTaskId, advanceTask };
