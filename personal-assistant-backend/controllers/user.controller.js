import { UserModel } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

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

        // Generar el salt y hash para la contraseña HASHEANDO CONTRASEÑAS
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Crear el usuario con la contraseña encriptada
        const newUser = await UserModel.create({ name, email, password: hashedPassword });


        const token = jwt.sign({
            email: newUser.email,
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )


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
        
        const {email, password}= req.body
        console.log('correo ingresado:', email);

        if(!email || !password) {
            return res
            .status(400).json({error: 'Invalid email or password'});
        }

        const user = await UserModel.findOneByEmail(email)
        console.log('Usuario encontrado:', user);

        if(!user){
            return res
           .status(404).json({error: 'User not found'});
        }

        const isMatch = await bcryptjs.compare(password, user['password']);

        if(!isMatch){
            return res
           .status(403).json({error: 'Invalid credentials'});
        }

        console.log('Nuevo usuario creado:', user);

        const token = jwt.sign({
            email: user.email,
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )

        console.log('Token generado:', token);

        return res.json({ ok: true, jwt: token, user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        });
    }
};

const profileDashBoard = async(req, res) => {
    try {
        const user = await UserModel.findOneByEmail(req.email);
        return res.json({ ok: true, msg: user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            msg: 'Server error'
        });
    }
}

export const UserController = {
    register,
    login,
    profileDashBoard
};
