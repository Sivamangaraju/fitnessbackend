const mongoose=require('mongoose')


const streekData= mongoose.Schema(
    
{
    userId:
    {
        type:String,
        required:true
    },
    streekCount:
    {
        type:Number,
        default:0
    },
    nextDate:
    {
        type:String,
        default:null
    }
}
)

module.exports= mongoose.model("streekData",streekData)