import express from "express";
import routes from "../routes";
import { 
    videoDetail,
    getUpload,
    postUpload
} from "../controllers/videoController";
import { uploadVideo} from "../middleware";


const videoRouter = express.Router();

videoRouter.get(routes.upload, getUpload);
videoRouter.post(routes.upload, uploadVideo, postUpload);

videoRouter.get(routes.videoDetail(), videoDetail);

export default videoRouter;