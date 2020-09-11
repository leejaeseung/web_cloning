import mongoose from "mongoose";
import "./users";

const commentSchema = new mongoose.Schema({
    videoID: {type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    parentComment: {type: String, ref: "Comment"},
    childCount: {type: Number, default: 0},
    text: {type: String, required:[true, "text is required!"]},
    isDeleted: Boolean,
    createdAt: String,
    updatedAt: String
}, {toObject:{ virtuals: true}});
//Object 형으로 내보낼 때, 가상 프로퍼티도 같이 내보내지게 허용

//가상 프로퍼티 정의
commentSchema.virtual("childComments")
.get(function() { return this._childComments;})
.set(function(value) { this._childComments = value;});

export default mongoose.model("Comment", commentSchema);