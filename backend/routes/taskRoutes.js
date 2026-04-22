import express from 'express'
import { createTask, deleteTask, deleteAccount, getTasks, countTasks, toggleTask, deleteAllTasks } from '../controllers/taskController.js'
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router()

router.use(authMiddleware)

router.post('/create', createTask);
router.get('/fetch', getTasks);
router.delete('/delete/:id', deleteTask);
router.delete('/deleteAll', deleteAllTasks);
router.delete('/deleteAccount', deleteAccount);
router.get('/count', countTasks);
router.patch('/toggle/:id', toggleTask)

export default router;