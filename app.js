
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
import expressValidator from "express-validator";
//유효성 검사 미들웨어
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

import { localsMiddleware } from "./middleware";

import routes from "./routes";


const app = express();

app.set("view engine", "pug");
//뷰 엔진을 pug로 설정

app.use("/uploads", express.static("uploads"));

app.use(cookieParser());
app.use(methodOverride());
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
app.use(expressValidator());
//여러 미들웨어 붙여주기

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);


//여러 루트들 설정

export default app;