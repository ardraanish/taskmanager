const User = require('../model/usermodel');
const Task = require('../model/taskmodel');

exports.statusEditpage = async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        const user = await User.findById(task.assignedTo);

        if(!task){
            return res.status(404).send('task not found')
        }
        const userId = user ? user._id : null;
        res.render('editStatus',{ task, userId, user});
    } catch(error){
        res.status(400).send(error.message)
    }
}
exports.employee= async(req,res)=>{
    console.log("adfbhsd");
    
    try {
        const {userId, role:userRole ,username}=req.user;
        if(!userId){
            return res.status(400).send('user ID is required')
        }
        const tasks = await Task.find({assignedTo:userId})
        .populate('createdBy','username');

        res.render ('employee',{tasks,userRole,username})
    } catch (error) {
        res.status(500).send('server error')
    }
}
exports.renderEditStatusPage = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const user = await User.findById(task.assignedTo);

        if (!task) {
            return res.status(404).send('Task not found');
        }
        const userId = user ? user._id : null;

        res.render('editStatus', { task, userId ,user}); 
    } catch (error) {
        console.error('Error rendering edit status page:', error);
        res.status(500).send('Server Error');
    }
};
// exports.renderUpdateTaskPage = async (req, res) => {
//     try {
//         const taskId = req.params.id; 
//         const task = await Task.findById(taskId); 
//         const users = await User.find({role:'employee'}); 
//         // const userId = req.user ? req.user._id : null;
    
//         const assignedUserId = task.assignedTo ? task.assignedTo._id : null;
//         console.log(assignedUserId,'srfhjkjjkjh')
//         res.render('updateTask', { task , users, assignedUserId}); 
        

//     } catch (err) {
//         console.error('Error fetching task:', err);
//         // res.status(500).send('Server Error'); server error while delete
//     }
// };
exports.renderCheckStatusPage = async (req, res) => {
    try {
        const tasks = await Task.aggregate([
            {
                $project: {
                    title: 1,
                    status: 1 
                }
            },
            {
                $group: {
                    _id: "$status",
                    tasks: {
                        $push: {
                            title: "$title"
                        }
                    }
                }
            }
        ]);

        const groupedTasks = {
            todo: tasks.find(task => task._id === 'To-Do')?.tasks || [],
            pending: tasks.find(task => task._id === 'Pending')?.tasks || [],
            completed: tasks.find(task => task._id === 'Completed')?.tasks || []
        };

        console.log('Grouped tasks by status:', groupedTasks);

        res.render('checkStatus', groupedTasks);
    } catch (error) {
        console.error('Error rendering check status page:', error);
        res.status(500).send('Server Error');
    }
};