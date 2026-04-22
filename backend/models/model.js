import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minLength: true
    }
}, {timestamps: true})


const taskSchema = new mongoose.Schema({
    title: {
        require : true,
        type: String,
        trim: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // stores userID ref from 'user'
        ref: 'User',
        required: true
    },
    deadline: {
        required: true,
        type: Date
    },

}, { timestamps: true })

export const userModel = mongoose.model('User', userSchema, 'users');
export const taskModel = mongoose.model('Task', taskSchema, 'tasks')