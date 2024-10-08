// const WorkoutDetails =require('../models/workout')

// const {StatusCodes} =require('http-status-codes')

// const addWorkout = async(req,res,next)=>
//     {
//     try {
//         //const {userId,email}=req.user   

//         const {workoutString}=req.body  
//         console.log({workoutString});
//         if(!workoutString)
//         {
//             return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:' Workout String missing'})

//         }
//         //changes workoutstring to lines
//         const eachworkout= workoutString.split(';').map((line)=>line.trim())

//         const categories=eachworkout.filter((line)=>line.startsWith("#"));
//         if(categories.length===0)
//         {
//             return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"No Category Found"})
//         }

//         const workoutList=[];
//         const currentCategory='';
//         let count=0;

//         await eachworkout.forEach((element)=>
//         {
//          count++
//          if(element.startsWith("#"))
//             {
//                 const parts=element?.split("\n").map((part)=>part.trim())
//                 console.log(parts)
//                 if(parts.length<5)
//                 {
//                     return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:`workout strings are missing ${count}`})
//                 }
//                 currentCategory=parts[0].substring(1).trim()
//                 //extract work details
//                 const workoutDetails=parseWorkoutDetails(parts);

//             }   
        
//         });

        
        



        
//     } catch (error) {
//         console.log(error)
        
//     }
// };

// //function to parse work out detail from body

// const parseWorkoutDetails=(parts)=>{
//     const details={}
//     console.log(parts);
//     if(parts>=5)
//     {
//         details.workoutName=parts[1].substring(1).trim();
//         details.sets=parseInt(parts[])
//     }
// }


// module.exports={addWorkout}

