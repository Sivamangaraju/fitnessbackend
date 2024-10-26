const mongoose=require('mongoose')


const WorkOutSchema= new mongoose.Schema(
{
    user:
    {
        type:mongoose.Schema.Types.ObjectId,  
        ref:"RegisterDetails",
        required:true
    },
    userId:{
        type:String
    },
    exercise:
    {
        type:String,
    },
    category:{
        type:String
    },
    sets:
    {
        type:Number,
        default:0
    },
    reps:
    {
        type:Number,
        default:0
    },
    weight:
    {
        type:Number,
        default:0
    },
    duration:
    {
        type:Number,
        default:0
    },
    speed:
    {
        type:Number,
        default:0
    },
    caloriesBurned:
    {
        type:Number,
        default:0

    },
    date:
    {
        type:Date,
        default:Date.now
    }
},{timestamps:true})


module.exports=mongoose.model("WorkoutDetails",WorkOutSchema)
