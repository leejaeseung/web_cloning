import routes from "../routes"
import User from "../DBmodel/users";
import Video from "../DBmodel/videos";
import { mailSender} from "../middleware";

export const getJoin = (req, res) => {

    /*if(!req.session.certificate)
        req.session.certificate = null;*/

    res.render("join", {
        pageTitle: "Join"
    })
};

export const postJoin = (req, res, next) => {
    const { body: { userName, email, password1 , password2, err_msg}} = req;

    if(err_msg){
        req.flash("tryMsg", err_msg.msg);
        return res.redirect(routes.join);
    }

    User.findOne( {"userName": userName}, function(err, user) {
        if(err) next(new Error("DB 에러"));
        if(user) {
            //id가 이미 있으면

            req.flash("tryMsg", "이미 존재하는 ID입니다. 다시 입력해 주세요.");

            return res.redirect(routes.join);
        }

        User.findOne( {"email": email}, function(err, target){
            if(err) next(new Error("DB 에러"));
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
                email: email,
                imgUrl: "images/default.png"
            });
        
            return res.redirect(routes.home);
        }
        })
    });
};

export const postCheckId = async (req, res, next) => {
    const { body: { userName, err_msg} } = req;

    if(err_msg){
        req.flash("userName_msg", err_msg.msg);
        return res.redirect(routes.join);
    }

    await User.findOne({userName: userName}, async (err, user) => {
        if(err) next(new Error("DB Error"));

        if(user){
            req.flash("userName_msg", userName + "은 이미 존재하는 아이디입니다.")
            
            req.session.cert_ID = null;

            return res.redirect(routes.join);
        }
        else{
            req.session.cert_ID = userName;
           
            req.flash("userName_msg", userName + "은 사용 가능한 아이디입니다.")

            return res.redirect(routes.join);
        }
    })
}

export const postCheckEmail = async (req, res, next) => {
    const { body: { email, err_msg} } = req;

    if(err_msg){
        req.flash("email_msg", err_msg.msg);
        return res.redirect(routes.join);
    }

    await User.findOne({email: email}, async (err, em) => {
        if(err) next(new Error("DB Error"));

        if(em){
            req.flash("email_msg", email + "은 이미 등록된 이메일입니다.")
            
            req.session.cert_Email = null;

            return res.redirect(routes.join);
        }
        else{
            //이메일 인증 구현

            mailSender(email, "abcde");

            return res.redirect(routes.join);
        }
    })
}

export const getLogin = (req, res) => {

    res.render("login", {
        pageTitle: "Login",
        tryMsg: req.flash("tryMsg")
    })
};

export const postLogin = (req, res, next) => {

    const { body: { userName, password}} = req;

    User.findOne( {"userName" : userName}, function(err, user) {
        if(err) next(new Error("DB 에러"));
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

export const logout = async (req, res, next) => {
    
    //로그아웃 기능 구현!
    if(req.session.isLogin){
        await req.session.destroy(function(err) {
            req.session;
            if(err) {
                next(new Error("session Error"));
            }
        })
    }

    res.redirect(routes.home);
};

export const getEditProfile = (req, res) => {

    const {
        body: {user}
    } = req;

    res.render("editProfile", {
        pageTitle: "Edit Your Profile",
        imgUrl: user.imgUrl
    })
};

export const patchEditProfile = async (req, res, next) => {

    const {
        body: {
            user,
            userName,
            email,
            password_ori,
            password_new1,
            password_new2,
            err_msg
        }
    } = req;

    if(err_msg){
        req.flash(err_msg.tag + "_msg", err_msg.msg);
        return res.redirect(routes.editProfile(req.session.userName));
    }
            
            if(userName){

                User.findOne({"userName" : userName}, async function(err, target) {
                    if(err) next(new Error("DB 에러"));
                    if(target){
                        await req.flash("userName_msg", "이미 존재하는 아이디 입니다.");
                        
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
                    if(err) next(new Error("DB 에러"));
                    if(target){
                        await req.flash("email_msg", "이미 존재하는 e-mail 입니다.");
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

                if(password_ori !== user.password){
                    req.flash("password_ori_msg", "기존 비밀번호가 일치하지 않습니다.");

                    return res.redirect(routes.editProfile(req.session.userName));
                }
                else{
                    if(password_new1 !== password_new2){
                        //비밀번호 중복 확인

                        req.flash("password_new_msg", "두 비밀번호가 일치하지 않습니다.");

                        return res.redirect(routes.editProfile(req.session.userName));
                    }
                    else if(password_new1 == password_ori){
                        //기존 비밀번호와 일치 여부

                        req.flash("password_new_msg", "기존 비밀번호와 동일한 비밀번호 입니다.");

                        return res.redirect(routes.editProfile(req.session.userName));
                    }
                    else{
                        //비밀번호 변경 성공!

                        await User.update({ userName: user.userName },
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
                //사진 업데이트 시

                const {
                    file: {path}
                } = req;

                await User.update({ userName: req.session.userName },
                    {
                        $set: {
                            imgUrl: path
                            }
                    });               

                return res.redirect(routes.editProfile(req.session.userName));
            }
}

export const getMyVideos = async (req, res) => {

    const {
        body: {user}
    } = req;

    try{

    const videos = await Video.find({ "creator" : user.id});

    res.render("myVideos", {
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
    }
}

export const userDetail = (req, res) => {

    const {
        body: {user}
    } = req;

    res.render("userDetail", {
        pageTitle: user.userName + "'s Detail",
        userID: user._id,
        userName: user.userName,
        userEmail: user.email,
        imgUrl: user.imgUrl
    })
};