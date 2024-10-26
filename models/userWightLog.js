const mongoose= require('mongoose')


const userWeightLog= new mongoose.Schema(
    {
        userId:
        {
            type:String
        },
        userBodyWeight:
        {
            type:Number
        },
        date:
        {
            type:Date,
            default: Date.now
        }
    }
)

module.exports=mongoose.model("userWeightLog",userWeightLog)