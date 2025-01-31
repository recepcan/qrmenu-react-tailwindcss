export const verifyAdmin=(req,res,next)=>{
    if(!req.user.isAdmin){
        return res.status(403).json({
            message:"you are not admin ",
        })
    }
    console.log(req.user)
    next()
    }