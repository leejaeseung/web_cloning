import express from "express";
import Video from "../DBmodel/videos";
import routes from "../routes";

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

export const videoDetail = async (req, res) => {

    //console.log(req.params.id);

    const video = await Video.findOne( { _id: req.params.id });

    await Video.update({  })

    res.render("videoDetail", {
        pageTitle: "Video's Detail",
        video
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
        creator: {
            ownerID: req.session.userID
        }
    });

    //업로드 구현

    res.redirect(routes.videoDetail(newVideo.id));
};

export const editVideo = (req, res) => {
    res.render("editVideo", {
        pageTitle: "Edit Video"
    });
}
