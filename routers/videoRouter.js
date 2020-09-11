import express from "express";
import routes from "../routes";
import { 
    videoDetail,
    postComment,
    getEditVideo,
    patchEditVideo,
    getUpload,
    postUpload,
    postView,
    deleteVideo,
    getComments,
    deleteComment,
    putComment
} from "../controllers/videoController";
import { videoUploader, loginChecker, videoChecker} from "../middleware";


const videoRouter = express.Router();

videoRouter.get(routes.upload, loginChecker, getUpload);
videoRouter.post(routes.upload, loginChecker, videoUploader, postUpload);

videoRouter.get(routes.editVideo(), videoChecker,loginChecker, getEditVideo);
videoRouter.patch(routes.editVideo(), videoChecker,loginChecker, patchEditVideo);
videoRouter.get(routes.videoDetail(), videoChecker, videoDetail);

videoRouter.delete(routes.deleteVideo(), loginChecker, deleteVideo);

videoRouter.post(routes.comments(), videoChecker, loginChecker, postComment);

videoRouter.get(routes.comments(), getComments);
videoRouter.put(routes.putComment(), loginChecker, putComment);
videoRouter.delete(routes.deleteComment(), loginChecker, deleteComment);

videoRouter.post(routes.view, videoChecker, postView);

export default videoRouter;