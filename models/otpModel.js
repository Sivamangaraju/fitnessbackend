const mongoose=require('mongoose')


const otpSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    
},{timestamps:true})

//define a function to send otp to email





module.exports=mongoose.model('sendotp',otpSchema)



