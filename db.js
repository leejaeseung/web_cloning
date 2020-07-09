import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const startDB = () =>{
    function connect() {
        var url = process.env.MONGO_URL;

        mongoose.connect( url, {useUnifiedTopology: true, useNewUrlParser: true} , function(err){
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

/*export const videos = [{
    id: 1881,
    title: "A Study in Scarlet",
    description: "I should like to meet him",
    views: 28,
    videoFile: "https://interactive-examples.mdn.mozilla.net/media/examples/flower.webm",
    creator: {
        id: 12345,
        name: "LJS",
        email: "wasd222@naver.com",
    }
},
{
    id: 1234,
    title: "Avivia Mad Movie",
    description: "Avivia Mad Movie",
    views: 123,
    videoFile: "https://interactive-examples.mdn.mozilla.net/media/examples/flower.webm",
    creator: {
        id: 12345,
        name: "LJS",
        email: "wasd222@naver.com",
    }
},
{
    id: 1881,
    title: "A Study in Scarlet",
    description: "I should like to meet him",
    views: 28,
    videoFile: "https://interactive-examples.mdn.mozilla.net/media/examples/flower.webm",
    creator: {
        id: 12345,
        name: "LJS",
        email: "wasd222@naver.com",
    }
}]*/