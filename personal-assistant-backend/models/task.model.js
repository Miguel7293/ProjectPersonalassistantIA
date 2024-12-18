import { db } from '../database/connection.database.js';
const insert = async ({ Project_ID, Title, Description, Start_Date, End_Date, Due_Date, Status, Priority, Assigned_Points = 0 }) => {
    const formattedStartDate = Start_Date ? Start_Date : null;
    const formattedEndDate = End_Date ? End_Date : null;
    const formattedDueDate = Due_Date ? Due_Date : null;

    const query = {
        text: 'INSERT INTO TASK (Project_ID, Title, Description, Start_Date, End_Date, Due_Date, Status, Priority, Assigned_Points) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        values: [Project_ID, Title, Description, formattedStartDate, formattedEndDate, formattedDueDate, Status, Priority, Assigned_Points],  // Añadimos Assigned_Points
    };
    const { rows } = await db.query(query);
    return rows[0];
};


const selectByProjectID = async (Project_ID, user_id) => {
    try {
        if (!Project_ID || !user_id) {
            return { ok: false, msg: 'Project_ID and user_id are required' };
        }

        // Obtenemos el rol del usuario en el proyecto
        const userRole = await db.query(
            'SELECT Role FROM USER_PROJECT WHERE User_ID = $1 AND Project_ID = $2',
            [user_id, Project_ID]
        );

        if (userRole.rowCount === 0) {
            return { ok: false, msg: 'User is not assigned to this project' };
        }

        const role = userRole.rows[0].role;

        // Consultamos las tareas del proyecto y verificamos los permisos de edición
        const result = await db.query(
            `SELECT t.*, 
                    CASE WHEN ut.User_ID IS NOT NULL THEN true ELSE false END AS edited_permitted
             FROM TASK t
             LEFT JOIN USER_TASK ut ON t.Task_ID = ut.Task_ID AND ut.User_ID = $1
             WHERE t.Project_ID = $2`,
            [user_id, Project_ID]
        );

        const tasks = result.rows;

        // Iteramos sobre las tareas para calcular el porcentaje y sumar puntos completados
        for (let task of tasks) {
            const taskID = task.Task_ID || task.task_id; // Compatibilidad con mayúsculas y minúsculas

            if (!taskID) {
                console.error('Error: Task_ID no encontrado para esta tarea');
                continue;
            }

            // Consulta para obtener la suma de puntos completados de la tarea
            const progressQuery = {
                text: 'SELECT COALESCE(SUM(Points_Completed), 0) as Total_Completed FROM PROGRESS_TASK WHERE Task_ID = $1',
                values: [taskID],
            };
            const { rows: progress } = await db.query(progressQuery);

            // Obtenemos la suma de puntos completados (si no hay registros, asumimos 0 puntos)
            const totalCompleted = parseInt(progress[0]?.total_completed || 0, 10);

            // Obtenemos los puntos asignados a la tarea
            const assignedPoints = parseInt(task.assigned_points || 0, 10);

            // Calculamos el porcentaje de completado
            const completionPercentage = assignedPoints > 0
                ? (totalCompleted / assignedPoints) * 100
                : 0;

            // Añadimos los datos calculados a la tarea
            task.Completion_Percentage = Math.round(completionPercentage * 100) / 100; // Porcentaje redondeado a 2 decimales
            task.Total_Completed = totalCompleted; // Puntos completados como número entero

            // Agregamos el rol del usuario a cada tarea
            task.role = role; // Asignamos el rol a la tarea
        }

        // Retornamos las tareas con los porcentajes y puntos completados, junto con el rol del usuario
        return { ok: true, tasks };
        
    } catch (error) {
        console.error('Error ejecutando la consulta:', error); // Log en caso de error
        return { ok: false, msg: 'Internal Server Error' };
    }
};




const update = async ({ Task_ID, Title, Description, Start_Date, End_Date, Due_Date, Priority, Assigned_Points }) => {
    // Formatear las fechas si están presentes
    const formattedStartDate = Start_Date ? Start_Date : null;
    const formattedEndDate = End_Date ? End_Date : null;
    const formattedDueDate = Due_Date ? Due_Date : null;

    // Si no se pasa Assigned_Points, se establece en 0 (por defecto).
    const points = Assigned_Points !== undefined ? Assigned_Points : 0;

    // Consulta SQL con el campo Assigned_Points incluido
    const query = {
        text: `
            UPDATE TASK 
            SET Title = $2, Description = $3, Start_Date = $4, End_Date = $5, Due_Date = $6, Priority = $7, Assigned_Points = $8
            WHERE Task_ID = $1 RETURNING *`,
        values: [Task_ID, Title, Description, formattedStartDate, formattedEndDate, formattedDueDate, Priority, points],  // Añadimos Assigned_Points
    };

    // Ejecutar la consulta
    const { rows } = await db.query(query);

    // Retornar la tarea actualizada
    return rows[0];
};



const deleteTask = async (Task_ID) => {
    const query = {
        text: 'DELETE FROM TASK WHERE Task_ID = $1 RETURNING *',
        values: [Task_ID],
    };
    const { rows } = await db.query(query);
    return rows[0];
};


const getCollaboratorsByTaskId = async (taskId) => {
    // Consulta SQL que une las tablas USERS, USER_TASK y TASK
    const query = {
        text: `
            SELECT u.User_ID, u.Name, u.Email, u.Image_URL, ut.Completed
            FROM USERS u
            JOIN USER_TASK ut ON u.User_ID = ut.User_ID
            JOIN TASK t ON ut.Task_ID = t.Task_ID
            WHERE t.Task_ID = $1
        `,
        values: [taskId], // Usamos taskId como parámetro
    };

    const { rows } = await db.query(query);

    return rows; // Devuelve la lista de colaboradores para esa tarea
};

const addCollaboratorToTask = async (taskId, userId, completed = false) => {
    const query = {
        text: `
            INSERT INTO USER_TASK (Task_ID, User_ID, Completed) 
            VALUES ($1, $2, $3) 
            RETURNING *;  -- Esto te devolverá la fila insertada
        `,
        values: [taskId, userId, completed],
    };

    const { rows } = await db.query(query);
    return rows[0];  // Retorna el nuevo registro insertado
};

const removeCollaboratorFromTask = async (taskId, userId) => {
    const query = {
        text: `
            DELETE FROM USER_TASK 
            WHERE Task_ID = $1 AND User_ID = $2
            RETURNING *;  -- Esto puede ser útil para verificar si se eliminó correctamente
        `,
        values: [taskId, userId],
    };

    const { rows } = await db.query(query);
    return rows[0];  // Retorna el registro eliminado o null si no se encontró
};

const advanceTask = async (taskId, userId, pointsToAdvance) => {
    try {
        // Paso 1: Insertar el avance en la tabla PROGRESS_TASK
        const date = new Date().toISOString(); // Obtener la fecha y hora actual
        console.log(`Inserting progress for Task_ID: ${taskId}, User_ID: ${userId}, Points: ${pointsToAdvance} on ${date}`);

        const insertQuery = {
            text: `
                INSERT INTO PROGRESS_TASK (Task_ID, Date, Points_Completed)
                VALUES ($1, $2, $3)
                RETURNING *;
            `,
            values: [taskId, date, pointsToAdvance],
        };

        const result = await db.query(insertQuery);
        const progressRecord = result.rows[0];

        console.log('Progress inserted:', progressRecord);

        // Paso 2: Sumar los puntos completados para este usuario específico
        const sumQuery = {
            text: `
                SELECT SUM(Points_Completed) AS total_points
                FROM PROGRESS_TASK
                WHERE Task_ID = $1 AND EXISTS (
                    SELECT 1
                    FROM USER_TASK
                    WHERE USER_TASK.Task_ID = $1
                    AND USER_TASK.User_ID = $2
                );
            `,
            values: [taskId, userId],
        };

        const sumResult = await db.query(sumQuery);
        const totalPoints = sumResult.rows[0].total_points || 0;
        
        console.log(`Total points for User_ID: ${userId} on Task_ID: ${taskId} is ${totalPoints}`);

        // Obtener los puntos asignados a la tarea
        const taskQuery = {
            text: `
                SELECT assigned_points
                FROM TASK
                WHERE Task_ID = $1;
            `,
            values: [taskId],
        };

        const taskResult = await db.query(taskQuery);

        // Agregar más depuración aquí
        console.log(`taskResult: ${JSON.stringify(taskResult.rows)}`);  // Verifica la salida completa

        const assignedPoints = taskResult.rows[0] ? taskResult.rows[0].assigned_points : null;
        console.log(`Assigned points for Task_ID: ${taskId} are ${assignedPoints}`);        

        // Paso 3: Verificar si los puntos completados para este usuario son suficientes
        if (totalPoints >= assignedPoints) {
            console.log(`User has completed enough points. Marking Task_ID: ${taskId} as COMPLETED`);

            // Si los puntos acumulados son suficientes, marcar la tarea como COMPLETED
            const updateTaskQuery = {
                text: `
                    UPDATE TASK
                    SET Status = 'COMPLETED'
                    WHERE Task_ID = $1;
                `,
                values: [taskId],
            };

            await db.query(updateTaskQuery);

            // Paso 4: Marcar la tarea como completada para el usuario
            const updateUserTaskQuery = {
                text: `
                    UPDATE USER_TASK
                    SET Completed = TRUE
                    WHERE Task_ID = $1 AND User_ID = $2;
                `,
                values: [taskId, userId],
            };

            await db.query(updateUserTaskQuery);
            console.log(`Task_ID: ${taskId} marked as completed for User_ID: ${userId}`);
        } else {
            console.log(`User has not completed enough points. Task remains in progress.`);
        }

        return progressRecord;
    } catch (error) {
        console.error('Error advancing task:', error);
        throw error;
    }
};



export const TaskModel = { insert, selectByProjectID, update, deleteTask, getCollaboratorsByTaskId, addCollaboratorToTask, removeCollaboratorFromTask, advanceTask};

