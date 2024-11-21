import { db } from '../database/connection.database.js';

const insert = async ({ Name, Start_Date, End_Date }) => {
    const query = {
        text: 'INSERT INTO PROJECT (Name, Start_Date, End_Date) VALUES ($1, $2, $3) RETURNING *',
        values: [Name, Start_Date, End_Date],
    };
    const { rows } = await db.query(query);
    return rows[0];
};

const selectById = async (Project_ID) => {
    const query = {
        text: 'SELECT * FROM PROJECT WHERE Project_ID = $1',
        values: [Project_ID],
    };
    const { rows } = await db.query(query);
    return rows[0];
};

const update = async ({ Project_ID, Name, Start_Date, End_Date }) => {
    const query = {
        text: `
            UPDATE PROJECT 
            SET Name = $2, Start_Date = $3, End_Date = $4
            WHERE Project_ID = $1 RETURNING *`,
        values: [Project_ID, Name, Start_Date, End_Date],
    };
    const { rows } = await db.query(query);
    return rows[0];
};

const deleteProject = async (Project_ID) => {
    const query = {
        text: 'DELETE FROM PROJECT WHERE Project_ID = $1 RETURNING *',
        values: [Project_ID],
    };
    const { rows } = await db.query(query);
    return rows[0];
};
const selectByUserId = async (User_ID) => {
    const query = {
        text: `
            SELECT P.*
            FROM PROJECT P
            INNER JOIN USER_PROJECT UP ON P.Project_ID = UP.Project_ID
            WHERE UP.User_ID = $1
        `,
        values: [User_ID],
    };
    const { rows } = await db.query(query);
    return rows;
};
export const ProjectModel = { insert, selectById, selectByUserId, update, deleteProject };
