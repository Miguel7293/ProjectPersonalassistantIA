import { db } from '../database/connection.database.js';

const insert = async ({ Project_ID, Title, Description, Start_Date, End_Date, Due_Date, Status, Priority }) => {
    const formattedStartDate = Start_Date ? Start_Date : null;
    const formattedEndDate = End_Date ? End_Date : null;
    const formattedDueDate = Due_Date ? Due_Date : null;

    const query = {
        text: 'INSERT INTO TASK (Project_ID, Title, Description, Start_Date, End_Date, Due_Date, Status, Priority) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        values: [Project_ID, Title, Description, formattedStartDate, formattedEndDate, formattedDueDate, Status, Priority],  // Añadimos Priority
    };
    const { rows } = await db.query(query);
    return rows[0];
};


const selectByProjectID = async (Project_ID) => {
    const query = {
        text: 'SELECT * FROM TASK WHERE Project_ID = $1',
        values: [Project_ID],
    };
    const { rows } = await db.query(query);
    return rows;
};

const update = async ({ Task_ID, Title, Description, Start_Date, End_Date, Due_Date, Status, Priority }) => {
    const formattedStartDate = Start_Date ? Start_Date : null;
    const formattedEndDate = End_Date ? End_Date : null;
    const formattedDueDate = Due_Date ? Due_Date : null;

    const query = {
        text: `
            UPDATE TASK 
            SET Title = $2, Description = $3, Start_Date = $4, End_Date = $5, Due_Date = $6, Status = $7, Priority = $8
            WHERE Task_ID = $1 RETURNING *`,
        values: [Task_ID, Title, Description, formattedStartDate, formattedEndDate, formattedDueDate, Status, Priority],  // Añadimos Priority
    };
    const { rows } = await db.query(query);
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

export const TaskModel = { insert, selectByProjectID, update, deleteTask };
