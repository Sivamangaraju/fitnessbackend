
const {StatusCodes}=require('http-status-codes')
const otpGenerator=require('otp-generator');
const sendotp=require('../models/otpModel');
const RegisterDetails=require('../models/register')
const bcrypt=require('bcryptjs');
const mailSender=require('../utils/mailSender')

//nodemailer verification
const sendVerification=async({email,otp},req,res)=>
{
    try {
        const mailResponse=await mailSender(email,
            "Verification Email",
            `<h1>Please confirm your otp </h1>
            <p>Here is your otp code: ${otp}</p>`
        );
        return mailResponse
    } catch (error) 
    {
        return res.status(StatusCodes.BAD_GATEWAY).json({success:false,message:error.message})    
    }
}



const sendOTP= async(req,res)=>{
    try 
    {
        const {email}=req.body
        const user=await RegisterDetails.findOne({email:email}).exec()
        //If user exited then send otp to corresponding mail
        if(!user)
        {
            return res.status(StatusCodes.BAD_REQUEST).json("Invalid Email");
        }
        let otp=String(otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false}));

        //check the email is present in sendotp table
        const otpUser=await sendotp.findOne({email:email}).exec()
        if(!otpUser)
        {
            const otpUser=await sendotp.create({email:email,otp:otp});
            console.log("otp record created");
        }
        else
        {
            otpUser.otp=otp
            await otpUser.save();
            console.log("OTP record updated");
        }
        const result= await sendVerification({email:email,otp:otp});
        //console.log(result)
        if(result)
        {
            return res.status(StatusCodes.CREATED).json({success:true,message:"Email Sent Successfully",otp,email:user.email});
        }
        else
        {
            return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Some Error Occurs while Sending Email"});
        }

    } 
    catch (error) 
    {
        return res.status(StatusCodes.BAD_GATEWAY).json({
        success:false,
        error:error.message
     })   
    }
}

//otp verifivation and 
const otpVerification= async(req,res)=>
{
  const {email,enteredOtp}=req.body
  if(!email || !enteredOtp)
  {
    return res.status(StatusCodes.BAD_REQUEST).json({success:false, messsage:'email and otp is required'})
  }
  const user=await sendotp.findOne({email})
  if(!user)
  {
    return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:'User email data not found'})
  }
  if(user.otp===enteredOtp)
  {
    return res.status(StatusCodes.OK).json({success:true,email:user.email,enteredOtp})
  }
  else{
    return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Otp is invalid, please enter valid OTP"})
  }

}

//password updation (API function password updation)

const updatePassword=async(req,res)=>
{
    const {email,password,confirmPassword}=req.body
    if(!password || !confirmPassword)
    {
        return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"password or confirmPassword is missing"})
    }
    if(!(password===confirmPassword))
    {
        return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Password and ConfirmPassword values need to be same, check once"})
    }
    const user =await RegisterDetails.findOne({email}).exec()
    if(!user)
    {
       return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Invalid Credentials"})

    }
    //const saltRounds= 10;
    // const hashedPassword= await bcrypt.hash(updatedPassword,saltRounds);
    user.password=password;
    await user.save()
    return res.status(StatusCodes.OK).json({success:true,message:"The password is updated",user:{email:user.email,id:user._id}})

}

module.exports={sendOTP,otpVerification,updatePassword}