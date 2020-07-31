import express from "express";
import Video from "../DBmodel/videos";
import User from "../DBmodel/users";
import routes from "../routes";
import fs from "fs";
import path from "path";

export const home = async (req, res) => {
    //async , await로 비디오 목록을 db에서 가져 온 뒤 렌더링

    //find 조건이 없기 때문에 저장된 모든 동영상을 뿌려줌
    try{
        const videos = await Video.find({});

        res.render("home", {
            pageTitle: "Main",
            videos
        });
    } catch (error) {
        console.log(error);

        res.render("home", {
            pageTitle: "Main",
            videos: []
        });
    }
};

export const search = (req, res) => {
    const {
        query: {search: searchTerm}
    } = req;

    Video.find( {title: searchTerm}, (err, videos) => {
    res.render("search", {
        pageTitle: "Search",
        searchTerm,
        videos
    });
});
};

export const videoDetail = async (req, res, next) => {

    await Video.findOne( { _id: req.params.id }, async (err, video) => {
        if(err) return next(new Error("DB Error"));

        if(video){
            var isCreator;

            if(video.creator == req.session.userID){
                isCreator = true;
            }
            else{
                isCreator = false;
            }

            await User.findOne({ _id: video.creator }, (err, user) => {
                if(err) return next(new Error("DB Error"));

                if(user){
                    res.render("videoDetail", {
                        pageTitle: "Video's Detail",
                        video,
                        isCreator,
                        creator: user.userName
                    });
                }
                else{
                    return next(new Error("User is not Exist"));
                }
            })
        }
        else{
            return next(new Error("Video is not Exist"));
        }
    });

    
};

export const postView = async (req, res) => {
    //조회수 증가
    
    await Video.findOne({_id: req.params.id}, (err, video) => {
        if(!video)  return res.status(404).json({error : "없는 비디오"});
        if(err) return res.status(400).json({error : "DB 에러"});

        console.log(video.views);

        video.views += 1;
        video.save();
        res.status(200);
    });
};

export const getUpload = (req, res) => {
    res.render("videoUpload", {
        pageTitle: "Upload Video"
    });
};

export const postUpload = async (req, res) => {

    const {
        body: {
            videoName,
            description
        },
        file: { path }
    } = req;

    const newVideo = await Video.create({
        videoName,
        description,
        views: 0,
        fileUrl: path,
        creator: req.session.userID
    });

    //업로드 구현

    res.redirect(routes.videoDetail(newVideo.id));
};

export const deleteVideo = async (req, res, next) => {
    
    const {
        body: {
            videoID
        }
    } = req;

    await Video.findOneAndDelete({ _id: videoID }, async (err, video) => {
        if(err) next(new Error("DB 에러"));

        if(!video)
            next(new Error("Video is Not Exist"));
        else{
            const filePath = path.join(__dirname + "/../", video.fileUrl);
            //현재 경로의 상위 경로 = nodejs, + 비디오 url

            await fs.unlink(filePath, (err) => {
                if(err) next(new Error("File load Error"))

            })
            res.redirect(routes.myVideos(req.session.userName));
        }
    });
}

export const getEditVideo = async (req, res, next) => {

    const videoID = req.params.id;

    await Video.findOne({ _id: videoID}, (err, video) => {
        if(err) next(new Error("DB Error"))

        if(video){

            res.render("editVideo", {
                pageTitle: "Edit Video",
                video
            });
        }
        else{
            next(new Error("video is not Exist"))
        }
    });

    
}

export const patchEditVideo = async (req, res, next) => {

    const {
        body: {
            videoName,
            description
        }
    } = req;

    console.log(req.body);

    console.log(req.params.id);

    const videoID = req.params.id;

    await Video.update({_id: videoID}, { $set: { videoName, description}}, (err) =>{
        if(err) next(new Error("DB Error"));
    });

    res.redirect(routes.myVideos(req.session.userName));
}