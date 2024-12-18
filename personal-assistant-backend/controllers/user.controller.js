import { UserModel } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/connection.database.js';  // Ajusta la ruta según tu estructura de carpetas

const register = async (req, res) => {
    try {
        const { name, email, password, image_url } = req.body;

        // Verificación de campos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({
                ok: false,
                msg: 'Missing required fields'
            });
        }

        // Verificar si el usuario ya existe
        const user = await UserModel.findOneByEmail(email);
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email already registered'
            });
        }

        // Generar contraseña encriptada
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Generar código único
        const unique_code = await generateUniqueCode();

        // Asignar imagen predeterminada si no se proporciona
        const finalImageUrl = image_url || "https://w.wallhaven.cc/full/j3/wallhaven-j36q3y.png";

        // Crear el usuario
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            unique_code,
            image_url: finalImageUrl
        });

        // Generar el token JWT
        const token = jwt.sign(
            { email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Responder con éxito
        return res.json({ ok: true, jwt: token, user: newUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid email or password'
            });
        }

        const user = await UserModel.findOneByEmail(email);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found'
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(403).json({
                ok: false,
                msg: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ ok: true, jwt: token, user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        });
    }
};

const profileDashBoard = async (req, res) => {
    try {
        const user = await UserModel.findOneByEmail(req.email);
        return res.json({ ok: true, user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const { name, password, image_url } = req.body;

        // Verifica que el usuario esté autenticado
        const userEmail = req.email; // El email se extrae del token verificado por el middleware
        const user = await UserModel.findOneByEmail(userEmail);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'User not found',
            });
        }

        // Prepara la consulta de actualización
        let updateFields = [];
        let updateValues = [];

        if (name) {
            updateFields.push('name');
            updateValues.push(name);
        }

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);
            updateFields.push('password');
            updateValues.push(hashedPassword);
        }

        if (image_url) {
            updateFields.push('image_url');
            updateValues.push(image_url);
        }

        // Verifica que haya al menos un campo para actualizar
        if (updateFields.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No update fields provided',
            });
        }

        // Construye la consulta SQL para actualizar
        const setClause = updateFields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = {
            text: `UPDATE users SET ${setClause} WHERE email = $${updateFields.length + 1} RETURNING *`,
            values: [...updateValues, userEmail],
        };

        const { rows } = await db.query(query);
        const updatedUser = rows[0];

        return res.json({
            ok: true,
            msg: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({
            ok: false,
            msg: 'Server error',
        });
    }
};


const generateUniqueCode = async () => {
    const generateCode = () => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length: 8 }, () =>
            charset[Math.floor(Math.random() * charset.length)]
        ).join('');
    };

    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
        uniqueCode = generateCode();
        const existingUser = await UserModel.findOneByUniqueCode(uniqueCode);
        if (!existingUser) {
            isUnique = true;
        }
    }

    return uniqueCode;
};

export const UserController = {
    register,
    login,
    profileDashBoard,
    updateProfile
};
