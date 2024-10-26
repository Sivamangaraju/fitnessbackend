const mongoose=require('mongoose')


const Profile= new mongoose.Schema({
    user:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'RegisterDetails',
        required:true

    },
    userId:
    {
        type:String
    },
    userName:
    {
        type:String,
    },
    email:{
        type:String,
        unique:true

    },
    height:
    {
        type:Number
    },
    weight:
    {
        type:Number
    },
    dob:
    {
        type:String
    },
    profilePic:
    {
        type:String
    }
})

module.exports=mongoose.model("UserProfile",Profile)