import mongoose from "mongoose";


const startDB = () =>{
    function connect() {
        var url = process.env.MONGO_URL;

        mongoose.connect( url, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false} , function(err){
            if(err){
                console.error("mongodb connection error", err);
            }
            console.log("mongodb connected");
        });
    };
    connect();
    mongoose.connection.on("disconnected", connect);
    require("./DBmodel/videos.js");
};

startDB();

export default startDB;