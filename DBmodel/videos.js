import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    views: Number,
    videoFile: String,
    creator: {
        id: Number,
        name: String,
        email: String,
    }
});

export default mongoose.model("Video", videoSchema);