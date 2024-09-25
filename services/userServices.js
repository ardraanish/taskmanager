const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/usermodel')

exports.registerUser = async (username, email, password, role)=>{
    if (!username || !email || !password || !role) {
        throw new Error("All fields are mandatory!");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error("User already exists");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        email,
        password: hashedPass,
        role,
    });

    return newUser;
};

exports.loginUser= async(email, password)=>{
    if(!email || !password) {
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const accessToken = jwt.sign(
        { user: { id: user._id, username: user.username, email: user.email, role:user.role } },
        process.env.SECRET_KEY,
        { expiresIn: "30m" }
    );

    return {
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role:user.role
        }

    };
};