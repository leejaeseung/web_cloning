import express from "express";
import routes from "../routes";
import {
    getEditProfile,
    patchEditProfile,
    userDetail
} from "../controllers/userController";
import { uploadProfile } from "../middleware";
import {userEditValidationRules, validate} from "../mylib/validator";

const userRouter = express.Router();

userRouter.get(routes.editProfile(), getEditProfile);
userRouter.patch(routes.editProfile(), uploadProfile, userEditValidationRules(), validate, patchEditProfile);

userRouter.get(routes.userDetail(), userDetail);

export default userRouter;