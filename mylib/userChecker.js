import User from "../DBmodel/users";

export const userLoader = async (req, res, next) => {
    await User.findOne( {"userName" : req.params.id}, function(err, user){
        req.body.user = user;
        console.log(user);
    }); 

    next();
}