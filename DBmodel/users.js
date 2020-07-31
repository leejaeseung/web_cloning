import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    imgUrl: String
});

export default mongoose.model("User", userSchema);