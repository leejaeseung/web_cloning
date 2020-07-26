import express from "express";
import routes from "../routes";
import {
    getEditProfile,
    patchEditProfile,
    userDetail,
    getMyVideos
} from "../controllers/userController";
import { uploadProfile } from "../middleware";
import {userEditValidationRules, validate} from "../mylib/validator";
import {userLoader} from "../mylib/userChecker";

const userRouter = express.Router();

userRouter.get(routes.editProfile(), userLoader, getEditProfile);
userRouter.patch(routes.editProfile(), userLoader, uploadProfile, userEditValidationRules(), validate, patchEditProfile);

userRouter.get(routes.myVideos(), userLoader, getMyVideos)
userRouter.get(routes.userDetail(), userLoader, userDetail);

export default userRouter;