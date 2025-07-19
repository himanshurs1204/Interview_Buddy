const express = require('express')
const{registerUser, getUser, loginUser} = require('../controller/auth.Controller')
const {protect} = require('../middlewares/auth.Middleware');
const upload = require('../middlewares/upload.Middleware');

const router = express.Router();

// Auth routes
router.post("/register",registerUser);  // Register user 
router.post("/login",loginUser);        // Login User
router.get("/profile",protect,getUser)  // Get user data

router.post("/upload-image", upload.single("image"), (req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"No file uploaded"})
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    res.status(200).json({imageUrl})
})


module.exports = router