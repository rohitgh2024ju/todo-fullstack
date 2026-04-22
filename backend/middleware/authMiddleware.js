import { JWT_SECRET } from "../../config/jwt.js";
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        };

        const decoded = jwt.verify(token, JWT_SECRET); // decoded = {id:, iat:, exp:}
        req.user = decoded;
        console.log('signed token : ', token);

        next();

    } catch (err) {
        return res.redirect('/login');
    };
}