const asyncHandler= require('express-async-handler')
const {registerUser, loginUser} =require('../services/userServices')

exports.UserSignup = asyncHandler(async(req,res)=>{
  const { username, email, password, role }=req.body;
  console.log('signup request received',req.body);

    try {
        // console.log('asdfghj')
        const newUser = await registerUser(username, email, password, role);
        res.redirect('/login').status(201).json({
          _id:newUser._id,
          username:newUser.username,
          email:newUser.email,
          role:newUser.role
        });
         
    } catch (error) {
        res.status(400).send(error.message)
    }
});


exports.userlogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const { accessToken, user } = await loginUser(email, password);

   
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 60 * 1000 // 30 minutes
    });

    
    if (user.role === 'manager') {
      res.redirect('/manager');
      console.log(user.role, "role");
    } else {
      res.redirect(`/employee`);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});


