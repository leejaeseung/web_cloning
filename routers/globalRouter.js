import express from "express";
import routes from "../routes";
import { logout } from "../controllers/userController";
import {home, search} from "../controllers/videoController";
import {
    getJoin,
    postJoin,
    postCheckId,
    postCheckEmail,
    getConfirmEmail,
    getLogin,
    postLogin
} from "../controllers/userController";
import {userValidationRules, validate} from "../mylib/validator";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);

globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, userValidationRules(), validate, postJoin);

globalRouter.post(routes.checkId, userValidationRules(), validate, postCheckId);
globalRouter.post(routes.checkEmail, userValidationRules(), validate, postCheckEmail);
globalRouter.get(routes.confirmEmail, getConfirmEmail);

globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.logout, logout);
globalRouter.get(routes.search, search);

export default globalRouter;