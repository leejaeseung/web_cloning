import routes from "./routes";
import multer from "multer";
import User from "./DBmodel/users";


const storage_VD = multer.diskStorage({destination: "uploads/videos/"})
const storage_PF = multer.diskStorage({destination: "uploads/profiles/", filename: function (req, file, cb) {

    cb(null, req.session.userID + ".png");
}})

// pug에서 사용될 지역 변수들을 관리해주는 미들웨어
export const localsMiddleware = (req, res, next) =>{
    res.locals.siteName = "JTube";
    res.locals.routes = routes;

    res.locals.nowUser = {
        isLogin: req.session.isLogin,
        userName: req.session.userName,
        email: req.session.email
    };

    next();
};

//해당 유저를 db에서 찾아 불러옴
export const userLoader = async (req, res, next) => {

    await User.findOne( {"userName" : req.params.id}, function(err, user){
        if(err) next(err);

        //console.log(user);

        if(user){
            req.body.user = user;
            next();
        }
        else
            next(new Error("user is not Exist"));
    }); 
}

//현재 로그인되어 있는지 체크
export const loginChecker = (req, res, next) => {

    const {
        body: {
            user
        }
    } = req;

    if(user){
        if(req.session.userName !== user.userName)
            next(new Error("user is not Logined"));
    }
    else{
        if(!req.session.isLogin)
            next(new Error("user is not Logined"));
    }
    next();
}

//에러 핸들러
export const handleError = (err, req, res, next) => {
    res.send(err.message);
}

export const videoUploader = multer({storage: storage_VD}).single("videoFile");
export const uploadProfile = multer({storage: storage_PF}).single("imgFile");