import { ProjectModel } from '../models/project.model.js';

const performOperation = async (req, res) => {
    try {
        const { sqlQuery, Project_ID, User_ID, Name, Start_Date, End_Date } = req.body;

        if (!sqlQuery) {
            return res.status(400).json({ ok: false, msg: 'sqlQuery is required' });
        }

        let result;
        switch (sqlQuery.toUpperCase()) {
            case 'INSERT':
                if (!Name || !Start_Date) {
                    return res.status(400).json({ ok: false, msg: 'Name and Start_Date are required for INSERT' });
                }
                result = await ProjectModel.insert({ Name, Start_Date, End_Date });
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
                if (!Project_ID || !Name || !Start_Date) {
                    return res.status(400).json({ ok: false, msg: 'Project_ID, Name, and Start_Date are required for UPDATE' });
                }
                result = await ProjectModel.update({ Project_ID, Name, Start_Date, End_Date });
                break;

            case 'DELETE':
                if (!Project_ID) {
                    return res.status(400).json({ ok: false, msg: 'Project_ID is required for DELETE' });
                }
                result = await ProjectModel.deleteProject(Project_ID);
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

export const ProjectController = { performOperation };
