import Video from "../DBmodel/videos";
import Comment from "../DBmodel/comments";
import routes from "../routes";
import fs from "fs";
import path from "path";

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

    Video.find( {title: searchTerm}, (err, videos) => {
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

    await Comment.find({videoID: video.id}, (err, comments) => {
        if(err) return next(new Error("DB Error"));

        console.log(comments);

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
            comment
        }
    } = req;

    await Comment.create({
        videoID: video.id,
        author: req.session.userID,
        parentComment: null,
        text: comment,
        isDeleted: false,
    }, (err, comment) => {
        if(err){
            req.flash("commentForm", {_id: null, form: {author: req.session.userID, video: video.id}});
            req.flash("commentError", {_id: null, error: err});
        }
    })

    res.redirect(routes.videoDetail(video.id));
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
        },
        file: { path }
    } = req;

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

export const deleteVideo = async (req, res, next) => {
    
    const {
        body: {
            videoID
        }
    } = req;

    await Video.findOneAndDelete({ _id: videoID }, async (err, video) => {
        if(err) next(new Error("DB 에러"));

        if(!video)
            next(new Error("Video is Not Exist"));
        else{
            const filePath = path.join(__dirname + "/../", video.fileUrl);
            //현재 경로의 상위 경로 = nodejs, + 비디오 url

            await fs.unlink(filePath, (err) => {
                if(err) next(new Error("File load Error"))

            })
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

    await Video.update({_id: video.id}, { $set: { videoName, description}}, (err) =>{
        if(err) next(new Error("DB Error"));
    });

    res.redirect(routes.myVideos(req.session.userName));
}