import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";
const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password, role = "user" } = req.body;
    if(!name || !email || !password )
        return res.status(400).json({message: "All fields are required"});
    
    const userExist = await User.findOne({email})
    if(userExist)
        return res.status(400).json({message: "User already exists"});
        
    const hashedpassword = await bcrypt.hash(password, 10);
    
    
    const newUser = await User.create({name, email, password: hashedpassword,role});
    let token = jwt.sign({email,id: newUser._id,role:newUser.role}, process.env.JWT_SECRET, {expiresIn: "1w"});

  return res.status(201).json({message: "User registered successfully", token, user: {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  }});

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password )
        return res.status(400).json({message: "All fields are required"});
    
    const userExist = await User.findOne({email})
    if(!userExist)
        return res.status(400).json({message: "User not found"});
        
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if(!isPasswordValid)
        return res.status(400).json({message: "Invalid password"});
        
    let token = jwt.sign({email,id: userExist._id,
        role:userExist.role
    }, process.env.JWT_SECRET, {expiresIn: "1w"});

  return res.status(201).json({message: "User logged in successfully", token, user: {
    id: userExist._id,
    name: userExist.name,
    email: userExist.email,
    role: userExist.role
  }});

});




export default router;