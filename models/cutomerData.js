const mongoose=require('mongoose')


const customerData= new mongoose.Schema(
    {
        userId:
        {
            type:String
        },
        email:
        {
            type:String
        },
        firstName:
        {
           type:String 
        },
        lastName:
        {
            type:String
        },
        mobile:
        {
            type:String
        },
        message:
        {
            type:String
        },
        date:
        {
            type:Date,
            default:Date.now
        }
    }
)

module.exports=mongoose.model('CustomerData',customerData)