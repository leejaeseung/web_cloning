import express from "express";
import {
    videos
} from "../db";

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

