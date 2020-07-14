import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoName: String,
    description: String,
    views: Number,
    fileUrl: String,
    creator: {
        userName: String,
        email: String,
    }
});

export default mongoose.model("Video", videoSchema);