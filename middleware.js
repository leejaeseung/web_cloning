import routes from "./routes";
import session from "express-session";

// pug에서 사용될 지역 변수들을 관리해주는 미들웨어

export const localsMiddleware = (req, res, next) =>{
    res.locals.siteName = "JTube";
    res.locals.routes = routes;

    res.locals.nowUser = {
        isLogin: req.session.isLogin,
        id: req.session.userID
    };

    next();
}