import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: String,
    password: String,
    email: String
});

export default mongoose.model("User", userSchema);