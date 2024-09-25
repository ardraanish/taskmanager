const express = require('express');
const controller = require('../controller/controller');
const userController = require('../controller/usercontroller');
const taskController = require('../controller/taskcontroller');
const viewController = require('../controller/viewController')
const {employeemiddile} = require('../middleware/authentication');
const {adminMiddleware}= require('../middleware/authorisation');
const task = require('../model/taskmodel');
const router = express.Router();


router.get('/status', controller.checkStatus);

router.get('/login', controller.login);
router.get('/register', controller.register);
router.post('/signup', userController.UserSignup);
router.post('/login', userController.userlogin);

router.get('/createtask', controller.createTask); 
// router.get('/edit', controller.editStatus); 

// router.get('/manager', controller.manager);
// router.get('/employee', controller.employee);


router.post('/createtask',adminMiddleware,taskController.createNewTask);
router.get("/manager",adminMiddleware,taskController.getAlltask)
router.get("/updateTask/:id",adminMiddleware,taskController.getById)
router.put("/updateTask/:id",adminMiddleware,taskController.updateTask)
router.delete('/deleteTask/:id',adminMiddleware , taskController.deleteTask);

router.get('/employee',employeemiddile,viewController.employee)
router.get('/employee/:id',employeemiddile, viewController.renderEditStatusPage);
router.put('/employee/:id',employeemiddile, taskController.editStatus);

// router.get('/checkStatus', adminMiddleware,taskController.checkTaskStatus);
router.get('/checkStatus',adminMiddleware,viewController.renderCheckStatusPage)

module.exports = router;
