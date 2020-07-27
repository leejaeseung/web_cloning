import User from "../DBmodel/users";

export const userLoader = async (req, res, next) => {

    await User.findOne( {"userName" : req.params.id}, function(err, user){
        if(err) next(err);
        if(user){
            req.body.user = user;
            next();
        }
        else
            next(new Error("user is not Exist"));
    }); 
}

export const loginChecker = (req, res, next) => {
    if(req.session.userName !== req.params.id)
        next(new Error("user is not Logined"));
    else
        next();
}