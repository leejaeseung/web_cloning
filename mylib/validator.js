/*import { body, validationResult } from "express-validator";

const userValidationRules = () => {
    return [
        body("id").isLength({max: 15, min: 5}),

        body("email").isEmail(),

        body("password").isLength({min: 5})
    ]
};


const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()){
        return next();
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg}));

    return res.status(422).json({
        errors: extractedErrors,
    })
}*/

function validCheck (req) {

    req.checkBody("id", "id는 5글자 이상, 15글자 이하입니다.").isLength({max: 15, min: 5});
    req.checkBody("email", "이메일 형식이 아닙니다.").isEmail();
    req.checkBody("password1", "password는 5글자 이상입니다.").isLength({min: 5});

    var errors = req.validationErrors();
    if(errors.length > 0){
        return errors[0].msg;
    }
    return "";
}

export default validCheck;