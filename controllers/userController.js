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

    if(t_msg){
        req.flash("tryMsg", t_msg[0].msg);
        return res.redirect(routes.join);
    }

    User.findOne( {"userName": userName}, function(err, user) {
        if(err) return res.status(500).json({error: err});
        if(user) {
            //id가 이미 있으면

            req.flash("tryMsg", "이미 존재하는 ID입니다. 다시 입력해 주세요.");

            return res.redirect(routes.join);
        }

        User.findOne( {"email": email}, function(err, target){
            if(err) return res.status(500).json({error: err});
            if(target){
                //email이 이미 있으면

                req.flash("tryMsg", "이미 등록된 email입니다. 다시 입력해 주세요.");

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
        })
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

    const {
        body: {user}
    } = req;

    if(!user)
        return res.status(404).json({error : "없는 아이디"});
    else if(req.session.userName !== req.params.id)
        return res.status(404).json({error : "로그인 된 아이디가 아님"});
    else {
        res.render("editProfile", {
            pageTitle: "Edit Your Profile",
            defaultImg: routes.profile + "/" + user._id + ".png",
            tryMsg: req.flash("tryMsg"),
            id_warn: req.flash("id_warn"),
            email_warn: req.flash("email_warn"),
            pwori_warn: req.flash("pwori_warn"),
            pwnew_warn: req.flash("pwnew_warn")
        })
    }
};

export const patchEditProfile = (req, res) => {

    const {
        body: {
            user,
            userName,
            email,
            password_ori,
            password_new1,
            password_new2,
            t_msg
        },
    } = req;

    console.log(t_msg);

        if(!user){
            return res.status(404).json({error : "없는 아이디"});
        }
        else {
            
            if(userName){
                if(t_msg.length > 4){
                    req.flash("id_warn", t_msg[0].msg);
                    return res.redirect(routes.editProfile(req.session.userName));
                }

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

                if(t_msg.length > 4){
                    req.flash("email_warn", t_msg[1].msg);
                    return res.redirect(routes.editProfile(req.session.userName));
                }

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
                //비밀번호 체크 업데이트하자!
                console.log(req.body);
                if(t_msg.length > 2){
                    req.flash("pwnew_warn", t_msg[2].msg);
                    return res.redirect(routes.editProfile(req.session.userName));
                }

                if(password_ori !== user.password){
                    req.flash("pwori_warn", "기존 비밀번호가 일치하지 않습니다.");

                    return res.redirect(routes.editProfile(req.session.userName));
                }
                else{
                    if(password_new1 !== password_new2){
                        //비밀번호 중복 확인

                        req.flash("pwnew_warn", "두 비밀번호가 일치하지 않습니다.");

                        return res.redirect(routes.editProfile(req.session.userName));
                    }
                    else if(password_new1 == password_ori){
                        //기존 비밀번호와 일치 여부

                        req.flash("pwnew_warn", "기존 비밀번호와 동일한 비밀번호 입니다.");

                        return res.redirect(routes.editProfile(req.session.userName));
                    }
                    else{
                        //비밀번호 변경 성공!

                        User.update({ userName: user.userName },
                            {
                                $set: {
                                    password: password_new1
                                    }
                            });

                        return res.redirect(routes.editProfile(req.session.userName));
                    }
                }
            }
            else{
                //사진 업데이트 시? -> 아무것도 안함
                return res.redirect(routes.editProfile(req.session.userName));
            }
        }
}

export const getMyVideos = (req, res) => {

    const {
        body: {user}
    } = req;

        if(!user){
            //id가 존재하지 않을 때

            return res.status(404).json({error : "없는 아이디"});
        }
        else if(req.session.userName !== req.params.id){
            return res.status(404).json({error : "로그인 된 아이디가 아님"});
        }
        else {

            res.render("myVideos", {
                pageTitle: "My Videos"
            })
        }
}

export const userDetail = (req, res) => {

    const {
        body: {user}
    } = req;

    console.log(user);

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
};