import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    date: Date,
    reason: String
});

export default mongoose.model("Appointment", AppointmentSchema);