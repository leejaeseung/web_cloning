import express from "express";
import {
    videos
} from "../db";

import routes from "../routes";

export const home = (req, res) => {
    res.render("home", {
        pageTitle: "Main",
        videos
    });
};

export const search = (req, res) => {
    const {
        query: {search: searchTerm}
    } = req;

    res.render("search", {
        pageTitle: "Search",
        searchTerm,
        videos
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

