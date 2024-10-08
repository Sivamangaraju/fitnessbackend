const mongoose=require('mongoose')


const WorkOutSchema= new mongoose.Schema(
{
    user:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"RegisterDetails",
        required:true
    },
    category:
    {
        type:String,
        rewuired:true   
    },
    WorkoutName:
    {
        type:String,
        required:true,
        unique:true
    },
    sets:
    {
        type:Number
    },
    reps:
    {
        type:Number
    },
    weight:
    {
        type:Number
    },
    duration:
    {
        type:Number
    },
    coloriesBurned:
    {
        type:Number

    },
    date:
    {
        type:Date,
        default:Date.now
    }
},{timestamps:true})


module.exports=mongoose.model("WorkoutDetails",WorkOutSchema)
