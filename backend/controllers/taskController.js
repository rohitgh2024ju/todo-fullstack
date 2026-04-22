import mongoose from 'mongoose';
import { userModel, taskModel } from '../models/model.js';

async function createTask(req, res) {
    try {
        const task = await taskModel.create({
            title: req.body.title,
            user: req.user.id,
            deadline: req.body.deadline
        });

        res.json(task);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


async function countTasks(req, res) {
    try {
        const stats = await taskModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id) // 🔥 FIX
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log("USER:", req.user.id);
        console.log(await taskModel.find({ user: req.user.id }));

        let completed = 0;
        let pending = 0;

        stats.forEach(item => {
            if (item._id === "completed") completed = item.count;
            if (item._id === "pending") pending = item.count;
        });

        const total = completed + pending;

        res.json({
            total,
            completed,
            pending
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getTasks(req, res) {
    try {
        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            priority: { priority: -1 },
            az: { title: 1 }
        };

        const sort = req.query.sort || 'newest';
        const tasks = await taskModel.find({ user: req.user.id }).sort(sortMap[sort] || sortMap.newest);

        res.json(tasks);

    } catch (err) {
        res.status(500).send('error fetching tasks')
    }
}

async function deleteTask(req, res) {
    try {
        await taskModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

async function deleteAccount(req, res) {
    try {
        await taskModel.deleteMany({ user: req.user.id });
        await userModel.findOneAndDelete({ _id: req.user.id });

        res.clearCookie('token');
        res.json({
            message: 'account deleted'
        });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function toggleTask(req, res) {
    const task = await taskModel.findById(req.params.id);

    if (task.status === 'completed') {
        task.status = 'pending';
    } else {
        task.status = 'completed';
    }

    await task.save();

    res.json({ success: true });
};

async function deleteAllTasks(req, res) {
    try {
        await taskModel.deleteMany({
            user: req.user.id
        });

        res.json({
            message: 'All tasks deleted'
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}

export {
    createTask,
    getTasks,
    deleteAccount,
    deleteTask,
    countTasks,
    toggleTask,
    deleteAllTasks
}