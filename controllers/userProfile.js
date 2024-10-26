const UserProfile=require('../models/profileData')
const RegisterDetails=require('../models/register')
const {StatusCodes}=require('http-status-codes')



const getProfileData= async(req,res)=>
{
    try 
    {
        const {userId:paramsId}=req.params
        const {userId,email}=req.user
        
        if(paramsId!==userId)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({success:false, message:"Authorization token data and provide id is not matching check once"})
        }

        const userProfileData= await UserProfile.findOne({userId}).exec()
        if(!userProfileData)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"UserProfile Data is not Exists check userId"})
        }
        return res.status(StatusCodes.OK).json({success:true,data:userProfileData})
    } catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:error.message})
    }
}
const updateProfileData=async(req,res)=>
{
    try 
    {
      const {userId}=req.body
      const profileData=req.body
      const userProfileData=await UserProfile.findOne({userId}).exec()
      const user=await RegisterDetails.findOne({_id:userId})
      if(!userProfileData )
        {
            return res.status(StatusCodes.BAD_GATEWAY).json({success:false,message:"UserProfile Data is not Exist, check userId"})
        }
        if(!user)
        {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"User register data is not Exists, register details are not getting"})
        }
        if(user.email!==profileData.email)
        {
            user.email=profileData.email
            await user.save()
        }
        userProfileData.user = userProfileData.user || userId;
        userProfileData.email=profileData.email?profileData.email:userProfileData.email,
        userProfileData.height=profileData.height?profileData.height:userProfileData.height,
        userProfileData.weight=profileData.weight?profileData.weight:userProfileData.weight,
        userProfileData.dob=profileData.dob?profileData.dob:userProfileData.dob,
        userProfileData.profilePic=profileData.profilePic?profileData.profilePic:userProfileData.profilePic
        await userProfileData.save()
        return res.status(StatusCodes.CREATED).json({success:true,data:userProfileData})
    }catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:error.message})
    }
}


module.exports={getProfileData,updateProfileData}