// const task = require('../router/route')
const User  =require("../model/usermodel")
const task = require('../model/taskmodel');

exports.checkStatus = (req,res)=>{
    // try {
    //     const 
    // } catch (error) {
    //     res.status(400).send(err.message)
    // }
    res.render('checkStatus')
}

exports.createTask= async(req,res)=>{
    try {
        const user = await User.find({role:"employee"})
        res.render("createTask",{user})
   
     } catch ( err) {
       res.status(400).send(err.message)
     }
}



exports.login =(req,res)=>{
    res.render('login')
}
 
exports.register =(req,res)=>{
    res.render('register')
}
exports.updateTask =(req,res)=>{
    res.render('updateTask')
}

