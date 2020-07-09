import routes from "./routes";

// pug에서 사용될 지역 변수들을 관리해주는 미들웨어

export const localsMiddleware = (req, res, next) =>{
    res.locals.siteName = "JTube";
    res.locals.routes = routes;

    res.locals.user = {
        isAuthenticated: false,
        id: 0
    };

    next();
}