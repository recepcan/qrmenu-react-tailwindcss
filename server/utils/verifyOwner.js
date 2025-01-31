export const verifyOwner=(req,res,next)=>{
    if(!req.user.isOwner){
        return res.status(403).json({
            message:"you are not owner ",
        })
    }
    console.log(req.user)
    next()
    }