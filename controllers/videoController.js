import Video from "../DBmodel/videos";
import Comment from "../DBmodel/comments";
import routes from "../routes";
import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

export const home = async (req, res) => {
    //async , await로 비디오 목록을 db에서 가져 온 뒤 렌더링

    //find 조건이 없기 때문에 저장된 모든 동영상을 뿌려줌
    try{
        const videos = await Video.find({});

        res.render("home", {
            pageTitle: "Main",
            videos
        });
    } catch (error) {
        console.log(error);

        res.render("home", {
            pageTitle: "Main",
            videos: []
        });
    }
};

export const search = (req, res) => {
    const {
        query: {search: searchTerm}
    } = req;

    Video.find( {videoName: searchTerm}, (err, videos) => {
    res.render("search", {
        pageTitle: "Search",
        searchTerm,
        videos
    });
});
};

export const videoDetail = async (req, res, next) => {
    const commentForm = req.flash("commentForm")[0] || {_id: null, form: {}};
    const commentError = req.flash("commentError")[0] || {_id: null, error: {}};

    const {
        body: {
            video,
            isCreator
        }
    } = req;

    await Comment.find({"videoID": video.id, "parentComment": null}).populate("author").exec((err, comments) => {
        if(err) return next(new Error("DB Error"));

        res.render("videoDetail", {
            pageTitle: "Video's Detail",
            video,
            isCreator,
            creator: video.creator.userName,
            comments
        });
    });
};

export const postComment = async (req, res) => {

    const {
        body: {
            video,
            comment,
            parent
        }
    } = req;

    console.log(parent);


    if(!parent){
        //일반 댓글인 경우
        try{
            await Comment.create({
                videoID: video.id,
                author: req.session.userID,
                parentComment: null,
                text: comment,
                isDeleted: false,
                createdAt: moment(Date.now()).format("YYYY-MM-DD HH:mm")
            })
        }
        catch(err) {
            req.flash("commentForm", {_id: null, form: {author: req.session.userID, video: video.id}});
            req.flash("commentError", {_id: null, error: err});
        }
    }
    else{
        await Comment.update({_id: parent}, {$inc: {childCount: 1}})

        //대댓글인 경우
        try{
            await Comment.create({
                videoID: video.id,
                author: req.session.userID,
                parentComment: parent,
                text: comment,
                isDeleted: false,
                createdAt: moment(Date.now()).format("YYYY-MM-DD HH:mm")
            })
        }
        catch(err) {
            req.flash("commentForm", {_id: null, form: {author: req.session.userID, video: video.id}});
            req.flash("commentError", {_id: null, error: err});
        }

    }

    res.redirect(routes.videoDetail(video.id));
}

export const getComments = (req, res, next) => {
    
    const videoID = req.params.id;

    const {
        query: {
            comment,
            reply
        }
    } = req;

    res.set("Content-Type", "text/plain");

    Comment.find({"videoID": videoID}).populate("author").exec(async (err, comments) => {
        if(err) return next(new Error("DB Error"));

        if(comment == "ALL"){
            return res.json(comments)
        }
        else{
            if(reply == "True"){
                var replyList = []

                for(var i = 0; i < comments.length; i++){
                    if(comments[i].parentComment == comment){
                        replyList.push(comments[i]);
                    }
                }

                await replyList.sort((a, b) => {
                    return a.createdAt < b.createdAt ? -1 : 1;
                })

                return res.json(replyList);
            }
            else if(reply == "False"){
                for(var i = 0; i < comments.length; i++){
                    if(comments[i]._id == comment){
                        return res.json(comments[i]);
                    }
                }
            }
        }
    })

    


}

export const deleteComment = (req, res, next) => {
    
    const videoID = req.params.vid;
    const commentID = req.params.cid;

    console.log("비디오 : " + videoID);
    console.log("댓글 : " + commentID);

    Comment.update({_id: commentID}, {
        $set: {
            isDeleted: true
        }}, (err) => {
            if(err) return next(new Error("DB Error"));

            res.redirect(routes.videoDetail(videoID));
    })
}

export const putComment = async (req, res, next) => {
    
    const videoID = req.params.vid;
    const commentID = req.params.cid;


}

export const postView = async (req, res) => {
    //조회수 증가

    const {
        body: {
            video
        }
    } = req;

    video.views += 1;
    video.save();
    res.status(200);
};

export const getUpload = (req, res) => {
    res.render("videoUpload", {
        pageTitle: "Upload Video"
    });
};

export const postUpload = async (req, res) => {

    const {
        body: {
            videoName,
            description
        }
    } = req;

    var path

    
    if(process.env.NODE_ENV == "production") {
        path = req.file.location
        //multer-S3 의 파일 URL 은 location에 저장됨.
    }
    else {
        path = "/" + req.file.path
    }

    const newVideo = await Video.create({
        videoName,
        description,
        views: 0,
        fileUrl: path,
        creator: req.session.userID
    });

    //업로드 구현

    res.redirect(routes.videoDetail(newVideo.id));
};

export const deleteVideo = (req, res, next) => {
    
    const videoID = req.params.id;

    Video.findOneAndDelete({ _id: videoID }, async (err, video) => {
        if(err) next(new Error("DB Error"));

        if(!video)
            next(new Error("Video is Not Exist"));
        else{

            if(process.env.NODE_ENV == "production") {
                const splitUrl = video.fileUrl.split('/');
                const fileName = splitUrl[splitUrl.length - 1]

                const params = {
                    Bucket: process.env.S3_BUCKET_NAME ,
                    Key: "uploads/videos/" + fileName
                }

                console.log(fileName);

                await s3.deleteObject(params, (err, data) => {
                    if(err) next(new Error("S3 Delete Error"))
                    else{
                        console.log("delete success" + data)
                    }
                })
            }
            else {
                const filePath = path.join(__dirname + "/../", video.fileUrl);
                //현재 경로(현재 경로 = 컨트롤러)의 상위 경로 = nodejs, + 비디오 url

                await fs.unlink(filePath, (err) => {
                    if(err) next(new Error("File load Error"))

                })
            }
            
            res.redirect(routes.myVideos(req.session.userName));
        }
    });
}

export const getEditVideo = async (req, res) => {

    //const videoID = req.params.id;

    const {
        body: {
            video
        }
    } = req;

    res.render("editVideo", {
        pageTitle: "Edit Video",
        video
    });
}

export const patchEditVideo = async (req, res, next) => {

    const {
        body: {
            video,
            videoName,
            description
        }
    } = req;

    try{
        await Video.update({_id: video.id}, { $set: { videoName, description}});
    }
    catch(err){
        next(new Error("DB Error"));
    }

    res.redirect(routes.myVideos(req.session.userName));
}