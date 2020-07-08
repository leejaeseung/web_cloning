import express, { response } from "express";

import routes from "../routes"

export const getJoin = (req, res) => {
    res.render("join", {
        pageTitle: "Join"
    })
};

export const postJoin = (req, res) => {
    const { body: { id, email, password1 , password2}} = req;

    if(password1 !== password2){
        res.status(400);
        // 비밀번호 미 일치 시 처리
    }
    else{
        console.log("회원가입 성공~");


        res.redirect(routes.home);
    }
};

export const getLogin = (req, res) => {
    res.render("login", {
        pageTitle: "Login"
    })
};

export const postLogin = (req, res) => {

    const { body: { id, password}} = req;

    /*if(password){
        res.status(400);
        // 비밀번호 미 일치 시 처리
    }
    else{*/
        console.log("로그인 성공~");

        res.redirect(routes.home);
    //}
};

export const logout = (req, res) => res.send("로그아웃 화면!");


export const editProfile = (req, res) => {
    res.render("editProfile", {
        pageTitle: "Edit Your Profile"
    })
};

export const userDetail = (req, res) => {
    res.render("userDetail", {
        pageTitle: "User's Detail"
    })
};