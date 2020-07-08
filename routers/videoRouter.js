import express from "express";
import routes from "../routes";
import { 
    videoDetail,
    getUpload,
    postUpload
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get(routes.upload, getUpload);
videoRouter.post(routes.upload, postUpload);

videoRouter.get(routes.videoDetail(), videoDetail);

export default videoRouter;