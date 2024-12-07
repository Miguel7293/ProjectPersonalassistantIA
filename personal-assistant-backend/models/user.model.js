import { db } from '../database/connection.database.js';

const create = async ({ name, email, password, unique_code, image_url }) => {
    const query = {
        text: `INSERT INTO users (name, email, password, unique_code, image_url)
               VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        values: [name, email, password, unique_code, image_url]
    };
    const { rows } = await db.query(query);
    return rows[0];
};

const findOneByEmail = async (email) => {
    const query = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email]
    };

    try {
        const { rows } = await db.query(query);
        return rows[0];
    } catch (err) {
        console.error('Database query error:', err);
        throw new Error('Database error');
    }
};

const findOneByUniqueCode = async (unique_code) => {
    const query = {
        text: 'SELECT * FROM users WHERE unique_code = $1',
        values: [unique_code]
    };

    try {
        const { rows } = await db.query(query);
        return rows[0];
    } catch (err) {
        console.error('Database query error:', err);
        throw new Error('Database error');
    }
};

export const UserModel = {
    create,
    findOneByEmail,
    findOneByUniqueCode
};
