import express from "express";
import routes from "../routes"
import User from "../DBmodel/users";

var loginFail = false;

export const getJoin = (req, res) => {
    res.render("join", {
        pageTitle: "Join",
        tryMsg: ""
    })
};

export const postJoin = (req, res) => {
    const { body: { id, email, password1 , password2}} = req;

    req.checkBody("id", "id는 5글자 이상, 15글자 이하입니다.").isLength({max: 15, min: 5});
    req.checkBody("email", "이메일 형식이 아닙니다.").isEmail();
    req.checkBody("password", "password는 5글자 이상입니다.").isLength({min: 5});
    

    var errors = req.validationErrors();
    if(errors.length > 0){
        return res.render("join", {
            pageTitle: "Join",
            tryMsg: errors[0].msg
        });
    }

    console.log(errors);

    User.findOne( {"id": id}, function(err, user) {
        if(err) return res.status(500).json({error: err});
        if(user) {
            //id가 이미 있으면
            return res.render("join", {
                pageTitle: "Join",
                tryMsg: "(이미 존재하는 ID입니다. 다시 입력해 주세요.)"
            });
        }
        else if(password1 !== password2){
            //비밀번호 미 일치시
            return res.render("join", {
                pageTitle: "Join",
                tryMsg: "(비밀번호가 일치하지 않습니다. 다시 입력해 주세요.)"
            });
        }
        else{
            //성공 시
            console.log("회원가입 성공~");
            //새 user Save
            new User({
                id: id,
                password: password1,
                email: email
            }).save(function (err) {
                if(err) return console.error(err);
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

    const { body: { id, password}} = req;

    User.findOne( {"id" : id}, function(err, user) {
        if(!user || user.password !== password){
            //id가 존재하지 않거나 비밀번호 미일치

            loginFail = true;
            
            res.redirect(routes.login);
        }
        else{
            console.log("로그인 성공~");

            req.session.isLogin = true;
            req.session.userID = id;

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
    res.render("editProfile", {
        pageTitle: "Edit Your Profile"
    })
};

export const userDetail = (req, res) => {
    res.render("userDetail", {
        pageTitle: "User's Detail"
    })
};

