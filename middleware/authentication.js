const jwt = require('jsonwebtoken');


exports.employeemiddile =async (req, res, next) => {
  // const token=
  let token;
  if(req.headers.cookie){
      token =req.headers.cookie.split("=")[1]
  }else{
      return res.redirect('/login')
  }

  // if (!token) {
  //     console.error('No token provided'); 
  //     .status(401).json({ message: 'No token, authorization denied' });
  // }

  try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // console.log('Decoded token:', decoded);  


      req.user = {
          userId: decoded.user.id,
          role: decoded.user.role   ,
          username:decoded.user.username
      };
      // console.log(req.user)

      if (req.user.role === 'employee') {
          // console.log("mNgetraiajcasjkdbcjhb")
          next();

      } else {
          res.redirect('/login');  

      }
  } catch (err) {
      res.redirect('/login');  

  }
};
