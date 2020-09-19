import mongoose from "mongoose";
import "./users";

const videoSchema = new mongoose.Schema({
    videoName: String,
    description: String,
    views: Number,
    fileUrl: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

videoSchema.statics.findAll = function(){
    return this.find({}).exec()
}

export default mongoose.model("Video", videoSchema);