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
                    result = await ProjectModel.insert({ Name, Start_Date, End_Date });
                    const newProjectId = result.project_id;

                    // Devolver la respuesta exitosa con los datos del proyecto y terminar la función
                    return res.json({ ok: true, data: { project_id: newProjectId, name: result.name, start_date: result.start_date, end_date: result.end_date } });
                } else {
                    return res.status(400).json({ ok: false, msg: 'Name and Start Date are required for INSERT' });
                }

            case 'INSERTRE':  // Nuevo caso para insertar en la relación USER_PROJECT
                if (!User_ID || !Project_ID) {
                    return res.status(400).json({ ok: false, msg: 'User_ID and Project_ID are required for INSERTRE' });
                }

                const userProjectData = {
                    User_ID,
                    Project_ID,
                    Role: 'Admin',
                    Assignment_Date: new Date().toISOString().split('T')[0],
                };

                result = await UserProjectModel.insert(userProjectData);

                // Devolver la respuesta exitosa de la relación y terminar la función
                return res.json({ ok: true, data: { User_ID, Project_ID } });

            case 'SELECT':
                if (User_ID) {
                    result = await ProjectModel.selectByUserId(User_ID);
                    return res.json({ ok: true, data: result });
                } else if (Project_ID) {
                    result = await ProjectModel.selectById(Project_ID);
                    return res.json({ ok: true, data: result });
                } else {
                    return res.status(400).json({ ok: false, msg: 'User_ID or Project_ID is required for SELECT' });
                }

            case 'UPDATE':
                if (!Project_ID || !Name || !Start_Date) {
                    return res.status(400).json({ ok: false, msg: 'Project_ID, Name, and Start_Date are required for UPDATE' });
                }
                result = await ProjectModel.update({ Project_ID, Name, Start_Date, End_Date, Description });
                return res.json({ ok: true, data: result });

            case 'DELETE':
                if (!Project_ID) {
                    return res.status(400).json({ ok: false, msg: 'Project_ID is required for DELETE' });
                }
                result = await ProjectModel.deleteProject(Project_ID);
                return res.json({ ok: true, data: result });

            default:
                return res.status(400).json({ ok: false, msg: 'Invalid sqlQuery' });
        }
    } catch (error) {
        console.error(error);
        // Verifica si las cabeceras ya fueron enviadas
        if (!res.headersSent) {
            res.status(500).json({ ok: false, msg: 'Server error', error: error.message });
        }
    }
};

export const ProjectController = { performOperation };
