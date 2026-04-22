import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/model.js';
import dotenv from 'dotenv';
dotenv.config();


async function signup(req, res) {
    try {
        const { username, email, password } = req.body;
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // save to db
        await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            result: 'sign up successful'
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                error: 'email already exists'
            })
        }
        res.status(500).json({
            error: err.message
        })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: 'user not found'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                error: 'invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });

        console.log('verified token : ', token);

        res.status(200).json({
            message: "Login successful"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

export { signup, login };