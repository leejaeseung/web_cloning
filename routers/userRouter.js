import express from "express";
import routes from "../routes";
import {
    getEditProfile,
    patchEditProfile,
    userDetail,
    getMyVideos
} from "../controllers/userController";
import { uploadProfile , userLoader, loginChecker} from "../middleware";
import {userEditValidationRules, validate} from "../mylib/validator";

const userRouter = express.Router();

userRouter.get(routes.editProfile(), userLoader, loginChecker, getEditProfile);
userRouter.patch(routes.editProfile(),  userLoader, loginChecker, userEditValidationRules(), validate, uploadProfile, patchEditProfile);

userRouter.get(routes.myVideos(), userLoader, loginChecker, getMyVideos)
userRouter.get(routes.userDetail(), userLoader, userDetail);

export default userRouter;