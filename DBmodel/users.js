import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String
});

export default mongoose.model("User", userSchema);