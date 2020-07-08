import express from "express";
import routes from "../routes"
import {
    editProfile,
    userDetail,
} from "../controllers/userController"

const userRouter = express.Router();

userRouter.get(routes.editProfile, editProfile);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;