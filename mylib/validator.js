import { check, validationResult } from "express-validator";

export const userValidationRules = () => {
    return [
        check("userName", "ID는 5글자 이상, 15글자 이하입니다.").isLength({max: 15, min: 5}),

        check("email", "이메일 형식이 아닙니다.").isEmail(),

        check("password1", "password는 5글자 이상입니다.").isLength({min: 5}),

        check("password2", "password는 5글자 이상입니다.").isLength({min: 5})
    ]
};

export const userEditValidationRules = () => {
    return [
        check("userName", "ID는 5글자 이상, 15글자 이하입니다.").isLength({max: 15, min: 5}),

        check("email", "이메일 형식이 아닙니다.").isEmail(),

        check("password_ori", "password는 5글자 이상입니다.").isLength({min: 5}),

        check("password_new1", "password는 5글자 이상입니다.").isLength({min: 5}),

        check("password_new2", "password는 5글자 이상입니다.").isLength({min: 5})
    ]
};

export const validate = (req, res, next) => {
    const errors = validationResult(req).errors;

    console.log(errors);

    for(var i = 0; i < errors.length; i++){
        //undefined가 아닌 경우에만 넣어줌
        if(errors[i].value || errors[i].value === ""){
            if(errors[i].param == "password_new1" || errors[i].param == "password_new2")
                errors[i].param = "password_new";
            req.body.err_msg = {tag: errors[i].param, msg: errors[i].msg};
            break;
        }
    }
    //에러 메세지 하나를 err_msg {tag, msg} 로 묶어서 보냄

    return next();
}