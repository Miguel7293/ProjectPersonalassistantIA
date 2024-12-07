import { TaskModel } from '../models/task.model.js';

const performOperation = async (req, res) => {
    try {
        const { sqlQuery, Task_ID, Project_ID, Title, Description, Start_Date, End_Date, Due_Date, Status, Priority } = req.body;

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
                const taskPriority = Priority || 'LOW';  // Valor por defecto si no se pasa

                const formattedStartDate = formatDate(Start_Date);
                const formattedEndDate = formatDate(End_Date);
                const formattedDueDate = formatDate(Due_Date);
            
                result = await TaskModel.insert({
                    Project_ID,
                    Title,
                    Description,
                    Start_Date: formattedStartDate,
                    End_Date: formattedEndDate,
                    Due_Date: formattedDueDate,
                    Status,
                    Priority: taskPriority,  // Usar Priority correctamente
                });
                break;

            case 'SELECT':
                if (!Project_ID) {
                    return res.status(400).json({ ok: false, msg: 'Project_ID is required for SELECT' });
                }
                result = await TaskModel.selectByProjectID(Project_ID);
                break;

            case 'UPDATE':
                if (!Task_ID || !Title) {
                    return res.status(400).json({ ok: false, msg: 'Task_ID and Title are required for UPDATE' });
                }

                const updatedStartDate = formatDate(Start_Date);
                const updatedEndDate = formatDate(End_Date);
                const updatedDueDate = formatDate(Due_Date);

                result = await TaskModel.update({
                    Task_ID,
                    Title,
                    Description,
                    Start_Date: updatedStartDate,
                    End_Date: updatedEndDate,
                    Due_Date: updatedDueDate,
                    Status,
                    Priority,
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

export const TaskController = { performOperation };
