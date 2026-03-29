import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    name: String,
    specialty: String,
    image: String,
    description: String,
    experienceYears: String
    

});

export default mongoose.model("Doctor", DoctorSchema);