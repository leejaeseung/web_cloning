import express from "express";
import routes from "../routes"
import User from "../DBmodel/users";


export const getJoin = (req, res) => {
    res.render("join", {
        pageTitle: "Join",
        tryMsg: ""
    })
};

export const postJoin = (req, res, next) => {
    const { body: { id, email, password1 , password2}} = req;

    User.findOne( {"id": id}, function(err, book) {
        if(err) return res.status(500).json({error: err});
        if(book) {
            //id가 이미 있으면
            return res.render("join", {
                pageTitle: "Join",
                tryMsg: "(이미 존재하는 ID입니다. 다시 입력해 주세요.)"
            });
            
        }
        else if(password1 !== password2){
            //비밀번호 미 일치시
            res.render("join", {
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
    
            res.redirect(routes.home);
        }
    });
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

export const logout = (req, res) => {

//로그아웃 기능 구현!

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

