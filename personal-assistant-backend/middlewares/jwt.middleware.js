import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    let token=req.headers.authorization

    if (!token) {
        return res.status(401).json({ ok: false, msg: 'No token provided' });
    }

    token = token.split(" ")[1]
    console.log('Token recibido:', token);

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Decoded token:', decoded);

        const { email } = decoded;
        if (!email) {
            throw new Error('Email not found in token');
        }

        req.email = email;
        next();

    }catch(error){
        return res.status(400).json({ error: "invalid token"})
    }


}