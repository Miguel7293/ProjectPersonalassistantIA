import { db } from '../database/connection.database.js';

const create = async ({ name, email, password }) => {
    const query = {
        text: 'INSERT INTO usuario (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING *',
        values: [name, email, password]
    };
    const { rows } = await db.query(query);
    return rows[0];
};

const findOneByEmail = async (email) => {
    const query = {
        text: 'SELECT * FROM usuario WHERE correo = $1',
        values: [email]
    };

    try {
        const { rows } = await db.query(query);
        console.log('Resultado de la consulta:', rows);
        return rows[0];  // Devuelve el primer usuario si existe
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        throw new Error('Database error');
    }
};


export const UserModel = {
    create,
    findOneByEmail
};
 