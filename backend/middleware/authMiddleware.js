import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // decoded = {id:, iat:, exp:}
        req.user = decoded;
        console.log('signed token : ', token);

        next();

    } catch (err) {
        return res.redirect('/login');
    };
}