import express from "express";
import Departments from "../models/Departments.js";
import auth from "../auth/Middleware.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "doctors",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });


router.post("/addDepartments",auth("admin"),upload.single("image"),async(req,res)=>{

    try {
        const {name,description} = req.body;
        if(!name){
            return res.status(400).json({message:"Name is required"});
        }
        const image = req.file ? req.file.path : "";    
        const newDepartment = await Departments.create({
            name,
            description,
            image
        });
        res.status(201).json(newDepartment);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error});
    }
})

router.get("/allDepartments",async(req,res)=>{
    try {
        const departments = await Departments.find({});
        res.json(departments);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error});
    }
})

router.get("/count",async(req,res)=>{
    try {
        const count = await Departments.countDocuments();
        res.json({count});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
} )


export default router;