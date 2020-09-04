
import express from 'express';
import morgan from "morgan";
//로그 미들웨어
import helmet from "helmet";
//보안 미들웨어
import bodyParser from "body-parser";
//바디 미들웨어 (POST 방식 전송을 위해)
import cookieParser from "cookie-parser";
//쿠키 데이터 미들웨어
import methodOverride from "method-override";
import session from "express-session";
//세션 미들웨어
import flash from "connect-flash";
//일회성 메세지 전용 미들웨어

import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

import { localsMiddleware, handleError } from "./middleware";

import routes from "./routes";


const app = express();

app.set("view engine", "pug");
//뷰 엔진을 pug로 설정

app.disable("x-powered-by");
//



if(process.env.NODE_ENV == "production") {
    app.use(express.static(__dirname + "/public"));
    app.use(express.static(__dirname + "/"));
}
else{
    //app.use("/uploads", express.static("uploads"));
    app.use(express.static(__dirname + "/public"));
    app.use(express.static(__dirname + "/"));
    //정적 파일 경로 설정 -> uploads는 나중에 수정해야됨.
}

app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan("short"));
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    //store: new FileStore()
    store: false
}));
app.use(flash());
//여러 미들웨어 붙여주기

app.locals.pretty = true;
//개발자 모드 이쁘게 -> 이거 안하면 한줄로 나옴

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

app.use(handleError);

//여러 루트들 설정

export default app;