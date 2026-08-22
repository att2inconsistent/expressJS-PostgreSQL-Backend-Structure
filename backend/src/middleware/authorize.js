function authorize(...allowedRoles){
    return function(req,res,next){
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({Message: "User is not permitted"})
        }else{
            next()
        }
    }
}

module.exports=authorize;