import express from "express";
import routes from "../routes";
import {
    getEditProfile,
    patchEditProfile,
    userDetail,
    getLoginedUser,
    getMyVideos
} from "../controllers/userController";
import { uploadProfile , userLoader, loginChecker} from "../middleware";
import {userEditValidationRules, validate} from "../mylib/validator";

const userRouter = express.Router();

userRouter.get(routes.userCheck, loginChecker, getLoginedUser);

userRouter.get(routes.editProfile(), loginChecker, userLoader,  getEditProfile);
userRouter.patch(routes.editProfile(),  loginChecker, userLoader,  userEditValidationRules(), validate, uploadProfile, patchEditProfile);

userRouter.get(routes.myVideos(), loginChecker, userLoader,  getMyVideos)
userRouter.get(routes.userDetail(), loginChecker, userLoader,  userDetail);

export default userRouter;