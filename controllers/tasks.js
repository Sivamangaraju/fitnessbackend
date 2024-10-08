const RegisterDetails=require('../models/register')
const {StatusCodes, BAD_REQUEST} =require('http-status-codes')
const jwr=require('jsonwebtoken');
// const { use } = require('react');
const {sendOTP}=require('../controllers/otpContoller')

const homepage=(req,res)=>{
    res.send('Home Page');
}
const getAllUsers= async(req,res)=>{
    const users=await RegisterDetails.find({})
    res.status(200).json(users);

}

const register= async(req,res)=>{
    const user= await RegisterDetails.create({...req.body})
    const token=user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.fullname},token})
}

//getUserDashboard

const getuserDashboard=async(req,res)=>
{
   return res.status(StatusCodes.OK).json({message:"Success",userDetails:{userId:req.user.userId,email:req.user.email}})
}

const login= async(req,res)=>{
    const {email,password}= req.body
    if(!email || !password)
    {
       return res.status(StatusCodes.BAD_REQUEST).json('Please provide email and password')
    }
    const user=await RegisterDetails.findOne({email:email}).exec()
    if(!user)
        {
          return  res.status(StatusCodes.UNAUTHORIZED).json({success:false,message:"Unable to find data, Invalid Email"});
        } 
    const isPasswordCorrect=await user.comparePassword(password)
    if(!isPasswordCorrect)
    {
       return res.status(StatusCodes.UNAUTHORIZED).json({success:false,message:"Invalid Password"});
       
    }
    const token=user.createJWT()
  return res.status(StatusCodes.OK).json({token,user:{id:user._id,email:user.email}})

}

//forgetPassword user
//otp send to email






const deleteUsers= async(req,res)=>
{
    try
    {
        const user=await RegisterDetails.deleteMany({})
        res.status(200).json({message:"success"})   
    } catch (error) 
    {
      res.status(500).json({message:error.message})   
    }
}

module.exports={homepage,getAllUsers,register,login,
    deleteUsers,getuserDashboard}