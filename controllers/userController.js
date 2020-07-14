import express from "express";
import routes from "../routes"
import User from "../DBmodel/users";
import validCheck from "../mylib/validator";

var loginFail = false;
var t_msg = "";

export const getJoin = (req, res) => {
    res.render("join", {
        pageTitle: "Join",
        tryMsg: t_msg
    })
};

export const postJoin = (req, res) => {
    const { body: { userName, email, password1 , password2}} = req;

    t_msg = validCheck(req);

    if(t_msg !== "")
        return res.redirect(routes.join);

    User.findOne( {"userName": userName}, function(err, user) {
        if(err) return res.status(500).json({error: err});
        if(user) {
            //id가 이미 있으면

            t_msg = "이미 존재하는 ID입니다. 다시 입력해 주세요.";

            return res.redirect(routes.join);
        }
        else if(password1 !== password2){
            //비밀번호 미 일치시
            
            t_msg = "비밀번호가 일치하지 않습니다. 다시 입력해 주세요.";

            return res.redirect(routes.join);
        }
        else{
            //성공 시
            console.log("회원가입 성공~");
            //새 user Create

            User.create({
                userName: userName,
                password: password1,
                email: email
            });
    
            return res.redirect(routes.home);
        }
    });
};

export const getLogin = (req, res) => {

    res.locals.loginFail = loginFail;

    res.render("login", {
        pageTitle: "Login"
    })
};

export const postLogin = (req, res, next) => {

    const { body: { userName, password}} = req;

    User.findOne( {"userName" : userName}, function(err, user) {
        if(!user || user.password !== password){
            //id가 존재하지 않거나 비밀번호 미일치

            loginFail = true;
            
            res.redirect(routes.login);
        }
        else{
            console.log("로그인 성공~");

            req.session.isLogin = true;
            //req.session.userID = user.id;
            req.session.userName = user.userName;
            req.session.email = user.email;

            //세션에 로그인한 유저 등록

            res.redirect(routes.home);
        }
    });
};

export const logout = (req, res) => {

    //로그아웃 기능 구현!
    if(req.session.isLogin){
        req.session.destroy(function(err) {
            if(err) {
                console.log(err);
            }
        })
    }

    res.redirect(routes.home);
};

export const editProfile = (req, res) => {

    User.findOne( {"userName" : req.params.id}, function(err, user) {
        if(!user){
            //id가 존재하지 않을 때

            return res.status(404).json({error : "없는 아이디"});
        }
        else if(req.session.userName !== req.params.id){
            return res.status(404).json({error : "로그인 된 아이디가 아님"});
        }
        else {

            res.render("editProfile", {
                pageTitle: "Edit Your Profile"
            })
        }
    });
};

export const userDetail = (req, res) => {

    User.findOne( {"id" : req.params.userName}, function(err, user) {
        if(!user){
            //id가 존재하지 않을 때

            return res.status(404).json({error : "없는 아이디"});
        }
        else {
            res.render("userDetail", {
                pageTitle: req.params.userName + "'s Detail",
                userName: user.userName,
                userEmail: user.email
            })
        }
    });
};

