const jwt=require('jsonwebtoken')
const {StatusCodes}=require('http-status-codes')



const authMiddleware= async(req,res,next)=>{
    const authHeader= req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        return res.status(StatusCodes.UNAUTHORIZED).json('Please Provide Authorization token')
    }
    
    const token=authHeader.split(" ")[1]
    //console.log(token)
    try {
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        const {userId,email}=decoded
        req.user={userId,email}
        next()
    } catch (error) 
    { 
        console.error('JWT verification failed:', error.message); 
        return res.status(StatusCodes.UNAUTHORIZED).json('Not Authorized to this route')
    }
}
module.exports=authMiddleware