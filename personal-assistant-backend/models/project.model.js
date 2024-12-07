import { db } from '../database/connection.database.js';

const insert = async ({ Name, Start_Date, End_Date, Max_Points, Image_URL }) => {
    const query = {
        text: `
            INSERT INTO PROJECT (Name, Start_Date, End_Date, Max_Points, Image_URL) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
        values: [Name, Start_Date, End_Date, Max_Points, Image_URL],
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

const update = async ({ Project_ID, Name, Start_Date, End_Date, Max_Points, Image_URL }) => {
    const query = {
        text: `
            UPDATE PROJECT 
            SET 
                Name = $2, 
                Start_Date = $3, 
                End_Date = $4, 
                Max_Points = $5, 
                Image_URL = $6
            WHERE Project_ID = $1 
            RETURNING *`,
        values: [Project_ID, Name, Start_Date, End_Date, Max_Points, Image_URL],
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
            WHERE UP.User_ID = $1`,
        values: [User_ID],
    };
    const { rows } = await db.query(query);
    return rows;
};
// En el archivo 'userProject.model.js' o similar

export const UserProjectModel = {
    insert: async (data) => {
        const { User_ID, Project_ID, Role, Assignment_Date } = data;
        const query = {
            text: `INSERT INTO USER_PROJECT (User_ID, Project_ID, Role, Assignment_Date)
                   VALUES ($1, $2, $3, $4) RETURNING *`,
            values: [User_ID, Project_ID, Role, Assignment_Date],
        };

        const { rows } = await db.query(query);
        return rows[0];  // Regresar el primer resultado (el registro insertado)
    },
};

export const ProjectModel = { insert, selectById, selectByUserId, update, deleteProject };
