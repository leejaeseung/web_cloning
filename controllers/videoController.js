import express from "express";
import Video from "../DBmodel/videos";
import routes from "../routes";

export const home = (req, res) => {

    console.log(res.locals.nowUser.id);
    console.log(res.locals.nowUser.isLogin);

    //find 조건이 없기 때문에 저장된 모든 동영상을 뿌려줌
    Video.find( (err, videos) => {
    res.render("home", {
        pageTitle: "Main",
        videos
    });
});
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

export const videoDetail = (req, res) => {
    res.render("videoDetail", {
        pageTitle: "Video's Detail"
    });
};

export const getUpload = (req, res) => {
    res.render("videoUpload", {
        pageTitle: "Upload Video"
    });
};

export const postUpload = (req, res) => {

    const {
        body: {
            videoName,
            description,
            videoFile
        }
    } = req;

    res.redirect(routes.home);
};

