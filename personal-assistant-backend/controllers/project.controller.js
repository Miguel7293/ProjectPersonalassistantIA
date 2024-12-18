import { ProjectModel } from '../models/project.model.js';
import { UserProjectModel } from '../models/project.model.js';

const performOperation = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { 
            sqlQuery, 
            Project_ID, 
            User_ID, 
            Name, 
            Start_Date, 
            End_Date, 
            Max_Points, 
            Image_URL 
        } = req.body;

        if (!sqlQuery) {
            return res.status(400).json({ ok: false, msg: 'sqlQuery is required' });
        }

        let result;

        switch (sqlQuery.toUpperCase()) {
            case 'INSERT':
                if (Name && Start_Date) {
                    result = await ProjectModel.insert({
                        Name,
                        Start_Date,
                        End_Date,
                        Max_Points: Max_Points || 0,
                        Image_URL: Image_URL || 'Predeterminado'
                    });

                    const newProjectId = result.project_id;
                    return res.json({ 
                        ok: true, 
                        data: { 
                            project_id: newProjectId, 
                            name: result.name, 
                            start_date: result.start_date, 
                            end_date: result.end_date,
                            max_points: result.max_points,
                            image_url: result.image_url
                        } 
                    });
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
                    Role: 'ADMIN',
                    Assignment_Date: new Date().toISOString().split('T')[0],
                };
                
                result = await UserProjectModel.insert(userProjectData);
                return res.json({ ok: true, data: { User_ID, Project_ID } });
                
                case 'SELECT':
                    if (User_ID) {
                        result = await ProjectModel.selectByUserId(User_ID);
                        return res.json({ 
                            ok: true, 
                            data: result.map(project => ({
                                ...project,
                                role: project.role // Agrega el rol
                            }))
                        });
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
                result = await ProjectModel.update({
                    Project_ID,
                    Name,
                    Start_Date,
                    End_Date,
                    Max_Points: Max_Points || 0,
                    Image_URL: Image_URL || 'Predeterminado'
                });
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
        if (!res.headersSent) {
            res.status(500).json({ ok: false, msg: 'Server error', error: error.message });
        }
    }
};

const getCollaboratorsByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ ok: false, msg: 'Project ID is required' });
        }

        const collaborators = await UserProjectModel.getCollaboratorsByProjectId(projectId);

        return res.status(200).json({ ok: true, data: collaborators });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Server error', error: error.message });
    }
}

// Agregar nuevos colaboradores
const addCollaborator = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email, uniqueCode } = req.body;

        if (!projectId || (!email && !uniqueCode)) {
            return res.status(400).json({ ok: false, msg: 'Project ID and either Email or Unique Code are required' });
        }

        const user = await UserProjectModel.findByEmailOrUniqueCode(email, uniqueCode);

        if (!user) {
            return res.status(404).json({ ok: false, msg: 'User not found' });
        }

        const userProjectData = {
            User_ID: user.user_id,
            Project_ID: projectId,
            Role: 'COLLABORATOR',
            Assignment_Date: new Date().toISOString().split('T')[0],
        };

        const result = await UserProjectModel.insert(userProjectData);

        return res.status(201).json({ ok: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Server error', error: error.message });
    }
}

export const ProjectController = { performOperation, getCollaboratorsByProjectId, addCollaborator };
