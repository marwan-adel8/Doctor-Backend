import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js";
import User from "./routes/user.js";
import Doctor from "./routes/doctor.js";
import Appointment from "./routes/appointment.js";
import Departments from "./routes/departments.js";
dotenv.config();

connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use("/user", User);
app.use("/doctors", Doctor);
app.use("/departments", Departments);
app.use("/appointments", Appointment);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





