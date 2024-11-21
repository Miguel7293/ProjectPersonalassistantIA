import { TaskModel } from '../models/task.model.js';

const performOperation = async (req, res) => {
    try {
        const { sqlQuery, Task_ID, Project_ID, Title, Description, Start_Date, End_Date, Due_Date, Status } = req.body;

        if (!sqlQuery) {
            return res.status(400).json({ ok: false, msg: 'sqlQuery is required' });
        }

        let result;
        switch (sqlQuery.toUpperCase()) {
            case 'INSERT':
                if (!Project_ID || !Title || !Start_Date) {
                    return res.status(400).json({ ok: false, msg: 'Missing required fields for INSERT' });
                }
                result = await TaskModel.insert({ Project_ID, Title, Description, Start_Date, End_Date, Due_Date, Status });
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
                result = await TaskModel.update({ Task_ID, Title, Description, Start_Date, End_Date, Due_Date, Status });
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
