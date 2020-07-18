import routes from "./routes";
import multer from "multer";
import path from "path"

// pug에서 사용될 지역 변수들을 관리해주는 미들웨어
const storage_VD = multer.diskStorage({destination: "uploads/videos/"})
const storage_PF = multer.diskStorage({destination: "uploads/profiles/", filename: function (req, file, cb) {

    cb(null, req.session.userID + ".png");
}})

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

export const uploadVideo = multer({storage: storage_VD}).single("videoFile");
export const uploadProfile = multer({storage: storage_PF}).single("imgFile");