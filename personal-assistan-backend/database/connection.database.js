import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;


export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  allowExitOnIdle: true,
});

export const connectDB = async () => {
  try {
    await db.query('SELECT 1');
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
  }
};

connectDB(); // Asegúrate de llamar la función para iniciar la conexión
