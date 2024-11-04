const RegisterDetails=require('../models/register')
const UserProfile=require('../models/profileData')
const WorkoutDetails=require('../models/workout')
const sendotp= require('../models/otpModel')
const userWeightLog=require('../models/userWightLog')
const whatsappMessage=require('../models/whatAppMessage')
const streekData=require('../models/streekCount')
const {StatusCodes, BAD_REQUEST} =require('http-status-codes')
const jwr=require('jsonwebtoken');
const {sendOTP}=require('../controllers/otpContoller')
const CustomerData =require('../models/cutomerData')

const homepage=(req,res)=>{
    res.send('Home Page');
}
const getAllUsers= async(req,res)=>{
    const users=await RegisterDetails.find({})
    res.status(200).json(users);

}

const register= async(req,res)=>{

    try 
    {
        const user= await RegisterDetails.create({...req.body})
        const profileData=
        {
            userId:user._id,
            userName: user.userName,
            email: user.email,
            userMobile:null,
            height: null,
            weight: null,
            dob: "2001-03-26",
            profilePic: null,
        }
        const userProfile= await UserProfile.create({...profileData,user:user._id})
        console.log(userProfile)
        const token=user.createJWT()
        return res.status(StatusCodes.CREATED).json({success:true,user:{id:user._id,email:user.email},token})
        
    } catch (error) 
    {
        return res.status(StatusCodes.BAD_GATEWAY).json({success:false,message:error.message})
    }

   
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
const deleteAccount= async(req,res,next)=>
{
    try 
    {
        const {userId,email}=req.user
        //Register Details
        const user= await RegisterDetails.findOne({_id:userId})
        if(!user)
        {
            console.log("User Register record not found")
        }
        else
        {
            await user.deleteOne()
            console.log("Register Account Deleted")
        }
        //User Profile
        const profileData=await UserProfile.findOne({userId})
        if(!profileData)
            {
                console.log("Profile Record Data Not Found")
            }
            else
            {
                await profileData.deleteOne()
                console.log("Profile Data Deleted")
            }
        //user WorkOut Details    
        const workoutData= await WorkoutDetails.find({userId}).exec()
        if(workoutData.length>0)
        {
            await WorkoutDetails.deleteMany({userId})
            console.log("Workout Details data deleted")
        }
        else
        {
            console.log("No Workout details found")
        }

        //User Otp Data
        const otpdata= await sendotp.findOneAndDelete({email})
        if(!otpdata)
        {
            console.log(" No OTP record present fot this user")
        }
        else{
            console.log("OTP record deleted successfully")
        }

        //user Weight Log Data
        const weightLogData= await userWeightLog.find({userId}).exec()
        if(weightLogData.length>0)
            {
                await userWeightLog.deleteMany({userId})
                console.log("userWeightLogData Details data deleted")
            }
            else
            {
                console.log("No userWeightLogData details found")
            }

        //User WhatApp Data    
        const whatsappData= await whatsappMessage.find({userId}).exec()
        if(whatsappData.length>0)
            {
                await whatsappMessage.deleteMany({userId})
                console.log("whatsappMessage data Details  deleted")
            }
            else
            {
                console.log("No whatsappMessage details found")
            }
        //User Streek Data    
        const streek= await streekData.findOneAndDelete({userId})  
        if(!streek)
            {
                console.log(" No streekData record present fot this user")
            }
            else{
                console.log("streekData record deleted successfully")
            }  
    return res.status(StatusCodes.OK).json({success: true, message:" Account Deleted Successfully "})

        
    } catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message:error.message})       
    }
}

const contactForm= async(req,res,next)=>
{
    try 
    {
        const {userId}=req.user
        const {firstName,lastName,mobile,message,email} =req.body
        const customerData= await CustomerData.create({...req.body})
        return res.status(StatusCodes.CREATED).json({success:true,customerData})

    } catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:error,message})
    }
}




const deleteAllUsers= async(req,res)=>
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
    deleteAllUsers,deleteAccount,contactForm}