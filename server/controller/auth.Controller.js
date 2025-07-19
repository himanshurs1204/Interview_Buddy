const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Genrate JWT web token

const generateToken = (userId) =>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET,{expiresIn: "7d"});
};


// @description  Register new User
// @route  POST /api/auth/register 
// @access Public

const registerUser = async (req, res) =>{
    try{
        const {name, email, password, profileImageUrl } = req.body

    // Check if User exists
    const userExists = await User.findOne({email})
    if(userExists){
        return res.status(400).json({message:"User Already Exists"})
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new User
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        profileImageUrl, 
    });

    // Return user data withJWT Token
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id),
    });
    }
    catch (error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}

// @description  Login User
// @route  POST /api/auth/login
// @access Public

const loginUser = async(req, res) =>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(500).json({message: "User Not Found"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(500).json({message: "Invalid Password"})
        } 

        // return user data with jwt token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        })

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
};

// @description  Get User profile
// @route  GET /api/auth/profile 
// @access private (Require JWT)

const getUser = async (req, res) =>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            res.status(404).json({message:"User Not found"})
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}


module.exports = {registerUser, loginUser, getUser}