const taskServices = require('../services/taskServices');
const Task = require("../model/taskmodel");
const User = require("../model/usermodel");

exports.createNewTask = async (req, res) => {
    const { taskname, taskdate, description, assignTo, status } = req.body;

    if (!taskname || !taskdate || !description || !assignTo || !status) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const userId = req.user.userId;
        const task = await taskServices.createTask({
            taskname,
            taskdate,
            description,
            assignTo,
            status,
            createdBy: userId
        });
        res.redirect("/manager");
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getAlltask = async (req, res) => {
    try {
        const { userId, role: userRole, username } = req.user;
        const task = await Task.find()
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');
        res.render('manager', { task, userId, userRole, username });
        console.log(task)
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Server Error');
    }
};

exports.getById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        const users = await User.find({ role: 'employee' });
        const assignedUserId = task.assignedTo ? task.assignedTo._id : null;
        res.render('updateTask', { task, users, assignedUserId });
    } catch (err) {
        console.error('Error fetching task:', err);
    }
};

exports.updateTask = async (req, res) => {
    const taskId  = req.params.id;
    console.log(taskId,"uuuuuuuuu");
    
    const { taskname, description, taskdate, assignTo, status } = req.body;
   
    try {
        console.log('ardradarasfsgdbjnjdnndhf')
        const task = await taskServices.updateTasks(taskId, { taskname, description, taskdate, assignTo, status });
        console.log(task)
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (err) {
        console.error('Error updating task in task controller:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.deleteTask = async (req, res) => {
    const  taskId = req.params.id;
    console.log(req.params.id)
    try {
        const task = await taskServices.deleteTasks(taskId);
        console.log(task,'aasdfghjkertyuxcvbnmsdfghjdfghwertyuiqwertyuiopasdfghjkcvbnm')
        if (task) {
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        console.error('Error deleting task in task controller:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.editStatus = async (req, res) => {
    const { id: taskId } = req.params;
    const { status} = req.body; 

    try {
        const updatedTask = await taskServices.updateTaskStatus(taskId, status);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.checkTaskStatus = async (req, res) => {
    try {
        const { todoTasks, pendingTasks, completedTasks } = await taskServices.getTasksByStatus();
        res.render('checkStatus', { todoTasks, pendingTasks, completedTasks });
    } catch (error) {
        res.status(500).send('Error fetching tasks');
    }
};