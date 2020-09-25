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

videoSchema.statics.findByCreator = function(creator_id){
    return this.find({"creator": creator_id}).exec()
}

videoSchema.statics.findByVideoName = function(videoName){
    return this.find({"videoName": videoName}).exec()
}

export default mongoose.model("Video", videoSchema);