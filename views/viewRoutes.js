import express from 'express';
import { authMiddleware } from '../backend/middleware/authMiddleware.js';
import { taskModel } from '../backend/models/model.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/dashboard');
});

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const tasks = await taskModel.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.render('dashboard', {
            username: req.user.username,
            tasks
        });
    } catch (err) {
        res.status(500).send('Error loading dashboard');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
})

export default router