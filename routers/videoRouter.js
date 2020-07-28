import express from "express";
import routes from "../routes";
import { 
    videoDetail,
    editVideo,
    getUpload,
    postUpload,
    postView,
    deleteVideo
} from "../controllers/videoController";
import { videoUploader, loginChecker} from "../middleware";


const videoRouter = express.Router();

videoRouter.get(routes.upload, getUpload);
videoRouter.post(routes.upload, loginChecker, videoUploader, postUpload);

videoRouter.get(routes.editVideo(), editVideo);
videoRouter.get(routes.videoDetail(), videoDetail);

videoRouter.delete(routes.deleteVideo, loginChecker, deleteVideo);

videoRouter.post(routes.view, postView);

export default videoRouter;