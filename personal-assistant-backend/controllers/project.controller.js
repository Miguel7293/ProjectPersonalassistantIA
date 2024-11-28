import { ProjectModel } from '../models/project.model.js';
import { UserProjectModel } from '../models/project.model.js';  // Asegúrate de que este modelo maneje la relación

const performOperation = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { sqlQuery, Project_ID, User_ID, Name, Start_Date, End_Date, Description } = req.body;

        if (!sqlQuery) {
            return res.status(400).json({ ok: false, msg: 'sqlQuery is required' });
        }

        let result;

        switch (sqlQuery.toUpperCase()) {
            case 'INSERT':
                if (Name && Start_Date) {
                    // Crear el proyecto
                    result = await ProjectModel.insert({ Name, Start_Date, End_Date });

                    // Obtener el project_id del nuevo proyecto
                    const newProjectId = result.project_id;

                    // Devolver la respuesta exitosa con los datos del proyecto
                    res.json({ ok: true, data: { project_id: newProjectId, name: result.name, start_date: result.start_date, end_date: result.end_date } });
                } else {
                    res.status(400).json({ ok: false, msg: 'Name and Start Date are required for INSERT' });
                }
                break;

            case 'INSERTRE':  // Nuevo caso para insertar en la relación USER_PROJECT
                if (!User_ID || !Project_ID) {
                    return res.status(400).json({ ok: false, msg: 'User_ID and Project_ID are required for INSERTRE' });
                }

                const userProjectData = {
                    User_ID,
                    Project_ID,  // ID del proyecto existente
                    Role: 'Admin',  // Asignar el rol de Admin
                    Assignment_Date: new Date().toISOString().split('T')[0],  // Fecha de asignación
                };

                // Insertar en la tabla USER_PROJECT
                result = await UserProjectModel.insert(userProjectData);

                // Devolver la respuesta exitosa de la relación
                res.json({ ok: true, data: { User_ID, Project_ID } });
                break;

            case 'SELECT':
                if (User_ID) {
                    // Seleccionar proyectos relacionados con el User_ID
                    result = await ProjectModel.selectByUserId(User_ID);
                } else if (Project_ID) {
                    // Seleccionar un proyecto específico por Project_ID
                    result = await ProjectModel.selectById(Project_ID);
                } else {
                    return res.status(400).json({ ok: false, msg: 'User_ID or Project_ID is required for SELECT' });
                }
                break;

            case 'UPDATE':
                // Validación de campos requeridos para la actualización
                if (!Project_ID || !Name || !Start_Date) {
                    return res.status(400).json({ ok: false, msg: 'Project_ID, Name, and Start_Date are required for UPDATE' });
                }
                // Actualizar el proyecto en la base de datos
                result = await ProjectModel.update({ Project_ID, Name, Start_Date, End_Date, Description });
                break;

            case 'DELETE':
                // Validación de campos requeridos para la eliminación
                if (!Project_ID) {
                    return res.status(400).json({ ok: false, msg: 'Project_ID is required for DELETE' });
                }
                // Eliminar el proyecto de la base de datos
                result = await ProjectModel.deleteProject(Project_ID);
                break;

            default:
                return res.status(400).json({ ok: false, msg: 'Invalid sqlQuery' });
        }
    } catch (error) {
        // En caso de error, devolver una respuesta de error con el mensaje de error
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Server error', error: error.message });
    }
};

export const ProjectController = { performOperation };
