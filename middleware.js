import routes from "./routes";
import multer from "multer";
import multerS3 from "multer-s3";
import User from "./DBmodel/users";
import Video from "./DBmodel/videos";
import nodemailer from "nodemailer";
//메일 전송 모듈
import smtpTransporter from "nodemailer-smtp-transport";
//smtp 서버 모듈
import crypto from "crypto";

import AWS  from "aws-sdk";
//아마존 sdk

const s3 = new AWS.S3();


var storage_VD;
var storage_PF;

if(process.env.NODE_ENV == "development"){

    //로컬 정적 저장 경로
    storage_VD = multer.diskStorage({destination: "uploads/videos/"})
    storage_PF = multer.diskStorage({destination: "uploads/profiles/", filename: function (req, file, cb) {

        cb(null, req.session.userID + ".png");
    }})

}
else if (process.env.NODE_ENV == "production"){

    //외부 정적 저장 경로
    storage_VD = multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME + "/uploads/videos",
        acl: "public-read-write",
    })
    storage_PF = multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME + "/uploads/profiles",
        key: function (req, file, cb) {
            cb(null, req.session.userID + ".png");
        },
        acl: "public-read-write",
    })

}

/*if(process.env.NODE_ENV == "development"){
    videoUploader = multer({storage: storage_VD_local}).single("videoFile");
    uploadProfile = multer({storage: storage_PF_local}).single("imgFile");
}
else if (process.env.NODE_ENV == "production"){
    videoUploader = multer({storage: storage_VD_cloud}).single("videoFile");
    uploadProfile = multer({storage: storage_PF_cloud}).single("imgFile");
}*/

export const videoUploader = multer({storage: storage_VD}).single("videoFile");
export const uploadProfile = multer({storage: storage_PF}).single("imgFile");

// pug에서 사용될 지역 변수들을 관리해주는 미들웨어
export const localsMiddleware = (req, res, next) =>{
    res.locals.siteName = "JTube";
    res.locals.routes = routes;

    res.locals.nowUser = {
        isLogin: req.session.isLogin,
        userName: req.session.userName,
        email: req.session.email
    };

    res.locals.message = req.flash("msg");

    //res.locals.userName_msg = req.flash("userName_msg");
    //res.locals.email_msg = req.flash("email_msg");
    //res.locals.pw_msg = req.flash("pw_msg");
    //res.locals.pwori_msg = req.flash("password_ori_msg");
    //res.locals.pwnew_msg = req.flash("password_new_msg");

    //res.locals.cert_ID = req.session.cert_ID;
    //res.locals.cert_Email = req.session.cert_Email;

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

export const videoChecker = async (req, res, next) => {

    const videoID = req.params.id;

    await Video.findOne({ _id: videoID}).populate("creator").exec((err, video) => {
        if(err) next(new Error("DB Error"))

        if(video){
            req.body.video = video;

            if(video.creator.userName == req.session.userName){
                req.body.isCreator = true;
            }
            else{
                req.body.isCreator = false;
            }

            next();
        }
        else{
            next(new Error("video is not Exist"))
        }
    });
}

export const generateCode = () => {
    var key1 = crypto.randomBytes(256).toString('hex').substr(100, 5);
    var key2 = crypto.randomBytes(256).toString('base64').substr(50, 5);
    var key = key1 + key2;

    return key;
}

export const mailSender = async (dest, code) => {

    let transporter = nodemailer.createTransport(smtpTransporter({
        // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
        service: 'gmail',
        // host를 gmail로 설정
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          // Gmail 주소 입력, 'testmail@gmail.com'
          user: process.env.NODEMAILER_USER,
          // Gmail 패스워드 입력
          pass: process.env.NODEMAILER_PASS,
        },
      }));

    await transporter.sendMail({
        
        from: "JTube" + process.env.NODEMAILER_USER,

        to: dest,

        subject: "JTube 가입 인증 메일",

        html: "<h1>다음 코드를 입력하세요.</h1><br>" + code
    })
}

//에러 핸들러
export const handleError = (err, req, res, next) => {
    res.send(err.message);
}
