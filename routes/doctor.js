import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Doctor from "../models/DoctorSchema.js";
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

router.post("/addDoctors", upload.single("image"), async (req, res) => {
  try {
    const { name, specialty, description, experienceYears } = req.body;
    if (!name || !specialty || !description || !experienceYears)
      return res.status(400).json({ message: "All fields are required" });

    const image = req.file ? req.file.path : "";

    const newDoctor = new Doctor({
      name,
      specialty,
      description,
      experienceYears,
      image,
    });
    
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});


router.get("/allDoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.get("/count",async(req,res)=>{
    try {
        const count = await Doctor.countDocuments();
        res.json({count});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
} )


router.get("/doctors/bySpecialty/:specialty",async(req,res)=>{
  try {
    const {specialty} = req.params;
    console.log('Searching for specialty:', specialty)
    const doctors = await Doctor.find({
      specialty : { $regex: new RegExp(specialty, 'i')}

    })

     console.log('Found doctors:', doctors.length);
    res.json(doctors);
  } catch (error) {
      console.error("error",error)
      res.status(500).json({message:error.message})
  }

})



router.get("/:id",async(req,res)=>{
    const doctor = await Doctor.findById(req.params.id);
    if(!doctor){
        return res.status(404).json({message:"Doctor not found"});
    }
    res.status(200).json(doctor);
  })

export default router;
