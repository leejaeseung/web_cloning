import express from "express";
import routes from "../routes";
import {
    getEditProfile,
    postEditProfile,
    userDetail
} from "../controllers/userController";
import { uploadProfile } from "../middleware";

const userRouter = express.Router();

userRouter.get(routes.editProfile(), getEditProfile);
userRouter.post(routes.editProfile(), uploadProfile, postEditProfile);

userRouter.get(routes.userDetail(), userDetail);

export default userRouter;