import express from "express";
import routes from "../routes";
import { 
    videoDetail,
    editVideo,
    getUpload,
    postUpload
} from "../controllers/videoController";
import { uploadVideo} from "../middleware";


const videoRouter = express.Router();

videoRouter.get(routes.upload, getUpload);
videoRouter.post(routes.upload, uploadVideo, postUpload);

videoRouter.get(routes.editVideo(), editVideo);
videoRouter.get(routes.videoDetail(), videoDetail);

export default videoRouter;