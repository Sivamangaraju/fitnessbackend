const {RegisterDetails} =require('../models/register')
const {StatusCodes}=require("http-status-codes")
export const getUserDashboard=async( req,res,next)=>
{
    try 
    {
      const {userId,email}=req.user 
      const user=  await RegisterDetails.findOne({email})
        
      if(!user)
      {
        return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"user not found"})
      }

      const currDate= new Date();

      const startToday=new Date(
        currDate.getFullYear(),
        currDate.getMonth(),
        currDate.getDate()
      )

      const endToday= new Date
      (
        currDate.getFullYear(),
        currDate.getMonth(),
        currDate.getDate()+1
      )
      




    } catch (error) 
    {
        
    }

}