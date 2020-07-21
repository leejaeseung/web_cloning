import express from "express";
import routes from "../routes"
import User from "../DBmodel/users";

export const getJoin = (req, res) => {

    res.render("join", {
        pageTitle: "Join",
        tryMsg: req.flash("tryMsg")
    })
};

export const postJoin = (req, res) => {
    const { body: { userName, email, password1 , password2, t_msg}} = req;

    if(t_msg !== ""){
        req.flash("tryMsg", t_msg);
        return res.redirect(routes.join);
    }

    User.findOne( {"userName": userName}, function(err, user) {
        if(err) return res.status(500).json({error: err});
        if(user) {
            //id가 이미 있으면

            req.flash("tryMsg", "이미 존재하는 ID입니다. 다시 입력해 주세요.");

            return res.redirect(routes.join);
        }
        else if(password1 !== password2){
            //비밀번호 미 일치시
            
            req.flash("tryMsg", "비밀번호가 일치하지 않습니다. 다시 입력해 주세요.");

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

    res.render("login", {
        pageTitle: "Login",
        tryMsg: req.flash("tryMsg")
    })
};

export const postLogin = (req, res) => {

    const { body: { userName, password}} = req;

    User.findOne( {"userName" : userName}, function(err, user) {
        if(!user || user.password !== password){
            //id가 존재하지 않거나 비밀번호 미일치
            
            req.flash("tryMsg", "잘못된 정보입니다. 다시 입력해 주세요.");
            res.redirect(routes.login);
        }
        else{
            console.log("로그인 성공~");

            req.session.isLogin = true;
            req.session.userID = user._id;
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

export const getEditProfile = (req, res) => {
    
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
                pageTitle: "Edit Your Profile",
                defaultImg: routes.profile + "/" + user._id + ".png",
                id_warn: req.flash("id_warn"),
                email_warn: req.flash("email_warn"),
                pwori_warn: req.flash("pwori_warn"),
                pwnew_warn: req.flash("pwnew_warn")
            })
        }
    });
};

export const postEditProfile = (req, res) => {

    console.log(req.body);

    const nowUser = req.params.id;

    const {
        body: {
            userName,
            email
        },
    } = req;

    console.log(nowUser);

    User.findOne( {"userName" : nowUser}, async function(err, user) {
        if(!user){

            return res.status(404).json({error : "없는 아이디"});
        }
        else {
            
            /*await User.update({ userName: user.userName },
            {
                $set: {
                    userName: userName,
                    email: email
                    }
            }
            );

            req.session.userName = userName;
            req.session.email = email;*/

            res.redirect(routes.userDetail(req.session.userName));
        }
    });
}

export const patchEditProfile = (req, res) => {

    const {
        body: {
            userName,
            email,
            password_ori,
            password_new1,
            password_new2
        },
    } = req;

    User.findOne( {"userName" : req.params.id}, async function(err, user) {
        if(!user){

            return res.status(404).json({error : "없는 아이디"});
        }
        else {
            
            if(userName){
                User.findOne({"userName" : userName}, async function(err, target) {

                    if(target){
                        await req.flash("id_warn", "이미 존재하는 아이디 입니다.");
                        
                    }
                    else{
                        await User.update({ userName: user.userName },
                            {
                                $set: {
                                    userName
                                }
                            });

                        req.session.userName = userName;
                    }
                    return res.redirect(routes.editProfile(req.session.userName));
                });
            }
            else if(email){
                User.findOne({"email" : email}, async function(err, target) {
                    if(target){
                        await req.flash("email_warn", "이미 존재하는 e-mail 입니다.");
                    }
                    else{
                        await User.update({ userName: user.userName },
                            {
                                $set: {
                                    email
                                    }
                            });
                        
                        req.session.email = email;  
                    }
                    return res.redirect(routes.editProfile(req.session.userName));
                });
            }
            else if(password_ori){
                console.log(req.body);

                return res.redirect(routes.editProfile(req.session.userName));
            }
            else{
                return res.redirect(routes.editProfile(req.session.userName));
            }
        }
    });
}

export const userDetail = (req, res) => {

    User.findOne( {"userName" : req.params.id}, function(err, user) {
        if(!user){
            //userName이 존재하지 않을 때

            return res.status(404).json({error : "없는 아이디"});
        }
        else {
            res.render("userDetail", {
                pageTitle: user.userName + "'s Detail",
                userID: user._id,
                userName: user.userName,
                userEmail: user.email
            })
        }
    });
};