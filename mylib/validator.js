import { check, validationResult } from "express-validator";

export const userValidationRules = () => {
    return [
        check("userName", "ID는 5글자 이상, 15글자 이하입니다.").isLength({max: 15, min: 5}),

        check("email", "이메일 형식이 아닙니다.").isEmail(),

        check("password1", "password는 5글자 이상입니다.").isLength({min: 5}),

        check("password2", "password는 5글자 이상입니다.").isLength({min: 5})
    ]
};


export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty())
        req.body.t_msg = "";
    else
        req.body.t_msg = errors.errors[0].msg;

    return next();
}