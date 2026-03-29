import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    image: String
});

export default mongoose.model("Department", DepartmentSchema);
