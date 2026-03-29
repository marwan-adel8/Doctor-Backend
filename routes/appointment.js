import express from "express";
import Appointment from "../models/AppointmentSchema.js";
import auth from "../auth/Middleware.js";

const router = express.Router();




router.post("/addAppointment",auth(),async(req,res)=>{
    try {
        const {doctor, date, reason} = req.body;
        if(!doctor || !date || !reason){
            return res.status(400).json({message:"All fields are required"});
        }
        const newAppointment = await Appointment.create({
            user: req.user.id,
            doctor,
            date,
            reason
        });
        res.status(201).json(newAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error});
    }
})

router.get("/myAppointments",auth(),async(req,res)=>{
    try {
        const appointments = await Appointment.find({user: req.user.id}).populate("doctor");
        res.status(200).json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error});
    }
})

router.post("/deleteAppointment/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const appointment = await Appointment.findByIdAndDelete(id);
        if(!appointment){
            return res.status(404).json({message:"Appointment not found"});
        }
        res.status(200).json({message:"Appointment deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error});
    }
})










export default router;
