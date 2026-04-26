const express = require("express")
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = process.env.JWT_SECRET;

router.post("/signup", async(req, res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"All fields required"
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            email,
            password : hashedPassword,
        });

        await user.save();
        res.json({message:"User created"});
    }catch(err){
        res.status(500).json(err);
    }
});


router.post("/login", async(req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(!user){
             return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }


        const token = jwt.sign(
            {id : user._id},
            SECRET,
            {expiresIn : "1d"}
        );

        res.json({token, user});
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;