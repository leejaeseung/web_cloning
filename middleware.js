import routes from "./routes";
import multer from "multer";

// pug에서 사용될 지역 변수들을 관리해주는 미들웨어
const upload = multer({dest: "uploads/videos/"})

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

export const uploadVideo = upload.single("videoFile");