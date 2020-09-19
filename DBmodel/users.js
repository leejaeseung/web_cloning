import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    imgUrl: String
});

userSchema.statics.findOneByUserName = function(userName){
    return this.findOne({
        "userName": userName
    }).exec()
}

userSchema.methods.verify = function(password){
    return this.password === password
}

export default mongoose.model("User", userSchema);