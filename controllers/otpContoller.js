
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
        console.log(result)
        if(result)
        {
            return res.status(StatusCodes.CREATED).json({success:true,message:"Email Sent Successfully",otp});
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

//otp verifivation and password updation

const otpVerification=async(req,res)=>
{
    const {email,otp,updatedPassword}=req.body
    if(!email || !otp || !updatedPassword)
    {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message:"Email, OTP and Updated Password mandatory"
        })
    }
    const user =await RegisterDetails.findOne({email}).exec()
    if(!user)
    {
       return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Invalid Credentials"})

    }
    const getOtp=await sendotp.findOne({email}).exec()
    if(!getOtp)
    {
       return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Invalid Email"});
    }
    if(getOtp.otp===otp)
    {
        const saltRounds= 10;
        // const hashedPassword= await bcrypt.hash(updatedPassword,saltRounds);
        user.password=updatedPassword;
        await user.save()
        return res.status(StatusCodes.OK).json({success:true,message:"The password updated",user})

    }
    else
    {
        return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Incorrect OTP"})
    }
}

module.exports={sendOTP,otpVerification}