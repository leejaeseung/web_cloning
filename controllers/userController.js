import routes from "../routes"
import User from "../DBmodel/users";
import Video from "../DBmodel/videos";
import { mailSender, generateCode, createToken } from "../middleware";

export const getJoin = async (req, res, next) => {

    /*if(!req.session.certificate)
        req.session.certificate = null;*/

        await req.session.destroy(function(err) {
            req.session;
            if(err) {
                next(new Error("session Error"));
            }
        })

    res.render("join", {
        pageTitle: "Join"
    })
};

export const postJoin = async (req, res, next) => {
    const { 
        body: { 
            userName, 
            email, 
            password1, 
            password2, 
            err_msg
            }
        } = req;

    res.set("Content-Type", "text/plain");

    if(!req.session.cert_ID || req.session.cert_ID != userName){
        
        return res.json({msg: "아이디 중복 체크를 해 주세요.",
                            color: "red",
                            tag: "userName_msg"})
    }

    if(!req.session.cert_Email || req.session.cert_Email != email){

        return res.json({msg: "이메일 인증을 해 주세요.",
                            color: "red",
                            tag: "email_msg"})
    }

    //console.log(err_msg);

    if(err_msg){
        return res.json({msg: err_msg.msg,
                        color: "red",
                        tag: "pw_msg"})
    }

    if(password1 !== password2){
        //비밀번호 미 일치시
    
        return res.json({msg: "비밀번호가 일치하지 않습니다. 다시 입력해 주세요.",
                color: "red",
                tag: "pw_msg"})
    }
    else{
    
    //성공 시
    //console.log("회원가입 성공~");
    //새 user Create
    
    User.create({
        userName: userName,
        password: password1,
        email: email,
        imgUrl: "images/default.png"
    });

    await req.session.destroy(function(err) {
        req.session;
        if(err) {
            next(new Error("session Error"));
        }
    })
        
    return res.json(null)
    }
};

export const postCheckId = async (req, res, next) => {
    const { body: { userName, err_msg} } = req;

    res.set("Content-Type", "text/plain");

    if(err_msg){
        return res.json({msg: err_msg.msg,
                        color: "red",
                        tag: "userName_msg"})
    }

    await User.findOne({userName: userName}, async (err, user) => {
        if(err) next(new Error("DB Error"));

        if(user){
        
            req.session.cert_ID = null;

            return res.json({msg: userName + "은 이미 존재하는 아이디입니다.",
                                color: "red",
                                tag: "userName_msg"})
        }
        else{
            req.session.cert_ID = userName;

            return res.json({msg: userName + "은 사용 가능한 아이디입니다.",
                                color: "green",
                                tag: "userName_msg"})
        }
    })
}

export const postCheckEmail = async (req, res, next) => {
    const { body: { email, err_msg} } = req;

    res.set("Content-Type", "text/plain");

    if(err_msg){
        return res.json({msg: err_msg.msg,
                            color: "red",
                            tag: "email_msg"})
    }

    await User.findOne({email: email}, async (err, em) => {
        if(err) next(new Error("DB Error"));

        if(em){
            
            req.session.cert_Email = null;

            return res.json({msg: email + "은 이미 등록된 이메일입니다.",
                                color: "red",
                                tag: "email_msg"})
        }
        else{
            //이메일 인증 구현

            req.session.code = generateCode();
            req.session.nowEmail = email;
            const code = req.session.code;

            mailSender(email, code);

            return res.json({msg: email + "로 인증 메일이 전송되었습니다.",
                                color: "green",
                                tag: "email_msg"})
        }
    })
}

export const postConfirmEmail = (req, res) => {
    const { body: { code} } = req;

    console.log(code);

    res.set("Content-Type", "text/plain");
    
    if(req.session.code == code){

        req.session.cert_Email = req.session.nowEmail;

        return res.json({msg: "인증 성공!",
                            color: "green",
                            tag: "email_msg"})
    }
    else{
        return res.json({msg: "인증 실패...",
                            color: "red",
                            tag: "email_msg"})
    }
}

export const getLogin = (req, res) => {

    res.render("login", {
        pageTitle: "Login",
        login_msg: req.flash("login-msg")
    })
};

export const postLogin = (req, res, next) => {

    const { 
        body: { 
            userName, 
            password
        }
    } = req;

    res.set("Content-Type", "text/plain");

    /*User.findOne( {"userName" : userName}, (err, user) => {
        if(err) next(new Error("DB 에러"));
        if(!user || user.password !== password){
            //id가 존재하지 않거나 비밀번호 미일치
            
            req.flash("login-msg", "잘못된 정보입니다. 다시 입력해 주세요.");
            //res.redirect(routes.login);
            res.json({
                success: false
            })
        }
        else{
            console.log("로그인 성공~");

            

            req.session.isLogin = true;
            req.session.userID = user._id;
            req.session.userName = user.userName;
            req.session.email = user.email;

            //세션에 로그인한 유저 등록

            //res.redirect(routes.home);
            res.json({
                success: true,
                
            })
        }
    });*/

    const checkUser = async (user) => {
        if(!user || !user.verify(password)){
            //id가 존재하지 않거나 비밀번호 미일치

            throw new Error("잘못된 정보입니다. 다시 입력해 주세요.")
        }
        else{
            
            //토큰 생성
            const token = await createToken(user._id, user.userName, user.email, '2h', 'Jtube.com', 'userInfo')

            return token
        }
    }

    const respond = (token) => {

        var exDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 3)
        
        res.cookie('token', token, {expires: exDate, httpOnly: true, signed: true})

        res.json({
            success: true,
            message: "로그인 성공"
        })
    }

    const error = (err) => {

        res.json({
            success: false,
            message: err.message
        })
    }

    User.findOneByUserName(userName)
    .then(checkUser)
    .then(respond)
    .catch(error)
};

export const logout = async (req, res, next) => {
    
    res.clearCookie("token")

    //로그아웃 기능 구현!
    /*if(req.session.isLogin){
        await req.session.destroy(function(err) {
            req.session;
            if(err) {
                next(new Error("session Error"));
            }
        })
    }*/

    res.redirect(routes.home);
};

export const getEditProfile = (req, res, next) => {

    const {
        body: {user},
        isOwner,
        success
    } = req;

    
    if(!isOwner)
        next(new Error("User is Not Logined"))


    res.render("editProfile", {
        pageTitle: "Edit Your Profile",
        imgUrl: user.imgUrl,
        userName: user.userName,
        userEmail: user.email,
        isLogin: success,
        isOwner
    })
};

export const patchEditProfile = async (req, res, next) => {

    try{

    const {
        body: {
            user: nowUser,
            userName: input_userName,
            email: input_email,
            password_ori: input_password_ori,
            password_new1: input_password_new1,
            password_new2: input_password_new2,
            err_msg
        },
        isOwner
    } = req;

    if(!isOwner)
        next(new Error("User is not Logined"))

    const exDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 3)

    res.set("Content-Type", "text/plain");

    if(err_msg){
        req.flash("msg", {tag: err_msg.tag + "_msg", text: err_msg.msg, clr: "red" });
        return res.redirect(routes.editProfile(nowUser.userName));
    }
            
            if(input_userName){

                User.findOne({"userName" : input_userName}, async function(err, target) {
                    if(err) next(new Error("DB 에러"));
                    if(target){
                        await req.flash("msg", {tag: "userName_msg", text: "이미 존재하는 아이디 입니다.", clr: "red" });
                        
                    }
                    else{
                        await User.update({ "userName": nowUser.userName },
                            {
                                $set: {
                                    "userName": input_userName
                                }
                            });

                        await req.flash("msg", {tag: "userName_msg", text: "아이디가 변경되었습니다.", clr: "green" });

                        //현재 이름으로 토큰 생성
                        const token = await createToken(nowUser._id, input_userName, nowUser.email, '2h', 'Jtube.com', 'userInfo')

                        //기존 토큰 삭제
                        res.clearCookie("token")

                        //새로운 토큰을 쿠키에 등록
                        res.cookie('token', token, {expires: exDate, httpOnly: true, signed: true})

                        nowUser.userName = input_userName
                    }

                    return res.redirect(routes.editProfile(nowUser.userName));
                });
            }
            else if(input_email){

                if(req.session.cert_Email !== req.session.nowEmail)
                    return next();

                User.findOne({"email" : input_email}, async function(err, target) {
                    if(err) next(new Error("DB 에러"));
                    if(target){
                        await req.flash("msg", {tag: "email_msg", text: "이미 존재하는 e-mail 입니다.", clr: "red" });
                    }
                    else{
                        await User.update({ "userName": nowUser.userName },
                            {
                                $set: {
                                    "email": input_email
                                    }
                            });
                        await req.flash("msg", {tag: "email_msg", text: "e-mail이 변경되었습니다.", clr: "green" });

                        //현재 이름으로 토큰 생성
                        const token = await createToken(nowUser._id, nowUser.userName, input_email, '2h', 'Jtube.com', 'userInfo')

                        //기존 토큰 삭제
                        res.clearCookie("token")

                        //새로운 토큰을 쿠키에 등록
                        res.cookie('token', token, {expires: exDate, httpOnly: true, signed: true})
                    }

                    return res.json({tag: "email_msg", text: "e-mail이 변경되었습니다.", clr: "green" })
                    //return res.redirect(routes.editProfile(req.session.userName));
                });
            }
            else if(input_password_ori){
                //비밀번호 체크 업데이트하자!

                if(input_password_ori !== nowUser.password){
                    req.flash("msg", {tag: "password_ori_msg", text: "기존 비밀번호가 일치하지 않습니다.", clr: "red" });

                    return res.redirect(routes.editProfile(nowUser.userName));
                }
                else{
                    if(input_password_new1 !== input_password_new2){
                        //비밀번호 중복 확인

                        req.flash("msg", {tag: "password_new_msg", text: "두 비밀번호가 일치하지 않습니다.", clr: "red" });

                        return res.redirect(routes.editProfile(nowUser.userName));
                    }
                    else if(input_password_new1 == input_password_ori){
                        //기존 비밀번호와 일치 여부

                        req.flash("msg", {tag: "password_new_msg", text: "기존 비밀번호와 동일한 비밀번호 입니다.", clr: "red" });

                        return res.redirect(routes.editProfile(nowUser.userName));
                    }
                    else{
                        //비밀번호 변경 성공!

                        await User.update({ "userName": nowUser.userName },
                            {
                                $set: {
                                    "password": input_password_new1
                                    }
                            });

                        return res.redirect(routes.editProfile(nowUser.userName));
                    }
                }
            }
            else{
                //사진 업데이트 시

                const {
                    file: {path}
                } = req;

                await User.update({ "userName": nowUser.userName },
                    {
                        $set: {
                            imgUrl: path
                            }
                    });               

                return res.redirect(routes.editProfile(nowUser.userName));
            }
        }
        catch(err){
            console.log(err);
            next(new Error(err))
        }
}

export const getMyVideos = async (req, res, next) => {

    const {
        body: {user: nowUser},
        isOwner,
        success
    } = req;

    if(!isOwner)
        next(new Error("User is not Logined"))

    //try{

    //const videos = await Video.find({ "creator" : user.id});

    Video.findByCreator(nowUser.id)
    .then(videos => {
        res.render("myVideos", {
            pageTitle: "My Videos",
            videos,
            isLogin: success
        });
    })

    /*res.render("myVideos", {
        pageTitle: "My Videos",
        videos
    });
    }
    catch(error){
        console.log(error);

        res.render("myVideos", {
            pageTitle: "My Videos",
            videos: []
        });
    }*/
}

export const userDetail = (req, res) => {

    const {
        body: {user: nowUser},
        isOwner,
        success
    } = req;


    res.render("userDetail", {
        pageTitle: nowUser.userName + "'s Detail",
        userName: nowUser.userName,
        userEmail: nowUser.email,
        imgUrl: nowUser.imgUrl,
        isLogin: success,
        isOwner
    })
};

export const getLoginedUser = (req, res) => {
    
    const {
        success
    } = req

    if(success){

        res.json({
            userName: req.userInfo.userName,
            email: req.userInfo.email
        })
    }
    else{
        next(new Error("User is not Logined"))
    }
}