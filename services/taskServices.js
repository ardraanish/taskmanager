const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Task = require('../model/taskmodel');

exports.createTask = async ({ taskname, taskdate, description, assignTo, status, createdBy }) => {
    try {
        const task = new Task({
            title: taskname,
            description,
            date: taskdate,
            assignedTo: assignTo,
            status,
            createdBy,
        });
        await task.save();
        return task;
    } catch (error) {
        console.error("Error creating task:", error.message);
        throw new Error("Task creation failed");
    }
};

exports.updateTasks = async (taskId,{ taskname, taskdate, description, assignTo, status, createdBy }) => {
    try {
        // if (!mongoose.Types.ObjectId.isValid(taskId)) {
        //     throw new Error('Invalid taskId format');
        // }

        const date = new Date(taskdate);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid taskDate');
        }

        return await Task.findByIdAndUpdate(taskId, {
            title: taskname,
            description,
            date,
            assignedTo: assignTo,
            status
        }, { new: true });
    } catch (err) {
        console.error('Error updating task in task service:', err);
        throw err;
    }
};

exports.deleteTasks = async (taskId) => {
    try {
        console.log(taskId)
        return await Task.findByIdAndDelete(taskId);
    } catch (err) {
        console.error('Error deleting task in task service:', err);
        throw err;
    }
};

exports.updateTaskStatus = async (taskId, status) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
        if (!updatedTask) {
            throw new Error('Task not found');
        }
        return updatedTask;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getTasksByStatus = async () => {
    try {
        const tasks = await Task.find({});

        const todoTasks = tasks.filter(task => task.status === 'To Do');
        const pendingTasks = tasks.filter(task => task.status === 'Pending');
        const completedTasks = tasks.filter(task => task.status === 'Completed');

        return { todoTasks, pendingTasks, completedTasks };
    } catch (error) {
        throw new Error('Error fetching tasks by status');
    }
};


