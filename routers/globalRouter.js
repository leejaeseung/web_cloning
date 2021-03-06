import express from "express";
import routes from "../routes";
import { logout } from "../controllers/userController";
import {home, search} from "../controllers/videoController";
import {
    getJoin,
    postJoin,
    postCheckId,
    postCheckEmail,
    postConfirmEmail,
    getLogin,
    postLogin
} from "../controllers/userController";
import {loginChecker} from '../middleware'
import {userValidationRules, validate} from "../mylib/validator";


const globalRouter = express.Router();

globalRouter.get(routes.home, loginChecker, home);

globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, userValidationRules(), validate, postJoin);

globalRouter.post(routes.checkId, userValidationRules(), validate, postCheckId);
globalRouter.post(routes.checkEmail, userValidationRules(), validate, postCheckEmail);
globalRouter.post(routes.confirmEmail, postConfirmEmail);

globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.logout, logout);
globalRouter.get(routes.search, search);

export default globalRouter;