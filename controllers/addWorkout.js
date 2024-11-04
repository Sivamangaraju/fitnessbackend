const express = require('express');
const { StatusCodes } = require('http-status-codes');
const WorkoutDetails  = require('../models/workout');
const UserProfile = require('../models/profileData');
const userWeightLog=require('../models/userWightLog')
const RegisterDetails = require('../models/register');
const userWightLog = require('../models/userWightLog');

const metValues={

        //Machine Exercise
            "Bench Press": { "MET": 3.5, "repTime": 30, "MachineExercise": true },
            "Incline Bench Press": { "MET": 3.5, "repTime": 30, "MachineExercise": true },
            "Chest Fly": { "MET": 4.0, "repTime": 30, "MachineExercise": true },
            "Cable Crossover": { "MET": 4.0, "repTime": 25, "MachineExercise": true },
            "Bent-Over Row": { "MET": 4.0, "repTime": 25, "MachineExercise": true },
            "Romanian Deadlifts": { "MET": 5.5, "repTime": 30, "MachineExercise": true },
            "Deadlifts": {"MET": 6.0, "repTime": 30, "MachineExercise": true  },
            "Lat Pulldown": { "MET": 4.0, "repTime": 25, "MachineExercise": true },
            "T-Bar Row": { "MET": 4.5, "repTime": 15, "MachineExercise": true },
            "Overhead Press": { "MET": 4.5, "repTime": 25, "MachineExercise": true },
            "Lateral Raise": { "MET": 4.0, "repTime": 20, "MachineExercise": true },
            "Front Raise": { "MET": 4.0, "repTime": 20, "MachineExercise": true },
            "Arnold Press": { "MET": 4.5, "repTime": 25, "MachineExercise": true },
            "Shrugs": { "MET": 4.0, "repTime": 15, "MachineExercise": true },
            "Bicep Curls": { "MET": 3.5, "repTime": 20, "MachineExercise": true },
            "Hammer Curls": { "MET": 3.5, "repTime": 20, "MachineExercise": true },
            "Concentration Curls": { "MET": 3.5, "repTime": 25, "MachineExercise": true },
            "Preacher Curls": { "MET": 3.5, "repTime": 25, "MachineExercise": true },
            "Tricep Pushdown": { "MET": 3.5, "repTime": 25, "MachineExercise": true },
            "Overhead Tricep Extension": { "MET": 3.5, "repTime": 25, "MachineExercise": true },
            "Skull Crushers": { "MET": 4.0, "repTime": 25, "MachineExercise": true },
            "Leg Press": { "MET": 4.0, "repTime": 30, "MachineExercise": true },
            "Good Mornings": { "MET": 4.0, "repTime": 30, "MachineExercise": true },
            "Cable Crunches": { "MET": 5.5, "repTime": 25, "MachineExercise": true },
            "Cable Kickbacks": { "MET": 4.0, "repTime": 25, "MachineExercise": true },
            "Calf Raises": { "MET": 3.5, "repTime": 15, "MachineExercise": true },
            "Seated Calf Raises": { "MET": 3.5, "repTime": 15, "MachineExercise": true },
            "Kettlebell Swings": { "MET": 9.0, "repTime": 20, "MachineExercise": true },
            "Snatches": { "MET": 9.0, "repTime": 60, "MachineExercise": true },
            "Clean and Press": { "MET": 8.0, "repTime": 30, "MachineExercise": true },
        
    

    //weight and bodyweight include both:
            "Squats": { "MET": 5.0 ,"repTime":25},
            "Lunges": { "MET": 5.0,"repTime":25 },
            "Bulgarian Split Squats": { "MET": 5.0 ,"repTime":30},
            "Step-Ups": { "MET": 4.0 ,"repTime":25},
            "Hip Thrusts": { "MET": 4.0,"repTime":25 },
            "Glute Bridge": { "MET": 4.0,"repTime":20 },
            "Russian Twists": { "MET": 5.0,"repTime":25 },
    



    //Body Weight Exercises ()
            "Push-ups": { "MET": 8.0 ,"repTime":15}, //
            "Pull-ups": { "MET": 8.0 ,"repTime":30},
            "Tricep Dips": { "MET": 5.0,"repTime":25 },
            "Hamstring Curls": { "MET": 3.5,"repTime":25 },
            "Crunches": { "MET": 5.0,"repTime":20 },
            "Sit-Ups": { "MET": 5.0 ,"repTime":20},
            "Leg Raises": { "MET": 4.0,"repTime":25 },
            "Reverse Crunches": { "MET": 4.0,"repTime":25 },
            "Hanging Leg Raises": { "MET": 6.0 ,"repTime":30},
            "Side Planks": { "MET": 3.0,"repTime":30 },
            "Bicycle Crunches": { "MET": 4.0,"repTime":25 },
            "Hyperextensions": { "MET": 3.5 ,"repTime":20},
            "Superman Exercise": { "MET": 4.0,"repTime":20 },
            "Rowing": { "MET": 7.0,"repTime":30},
            "Jump Rope": { "MET": 12.0, "repTime":10 },
            "Burpees": { "MET": 10.0,"repTime":30 },
            "Mountain Climbers": { "MET": 8.0,"repTime":30},
            "Jumping Jacks": { "MET": 8.0,"repTime":15 },
            "Box Jumps": { "MET": 9.0,"repTime":20 },
            "High Knees": { "MET": 8.0, "repTime":15},


    //speed and Distance
    "Running": { "MET": 10.0 },
    "Cycling": { "MET": 10.0 },
    "Sprint Intervals": { "MET": 12.0}, //speed and distance (HIIT exercise)
    
    //speed and time
    "Elliptical": { "MET": 8.0,"repTime":25 },

    //Time
    "Battle Ropes": { "MET": 8.0}
}

const addWorkout = async (req, res, next) => {
    const { userId } = req.user;
    const { weight, sets, reps,speed, distance,time, exercise,category ,userBodyWeight} = req.body;

    try {
        let userProfileData = await UserProfile.findOne({ userId }).exec();

        if (!userProfileData?.weight) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Please enter weight in the profile page.' });
        }

        let userWeight = userProfileData?.weight;
        //modify changes for logging userBody weight
        if(userWeight!==userBodyWeight)
        {
            userWeight=userBodyWeight;
            userProfileData.weight=userBodyWeight;
            await userProfileData.save()
        }
        const userBodyWeightDate= new Date()
        let userBodyWeightDateString=userBodyWeightDate.toISOString().split('T')[0]
        const weightLog = await userWeightLog.findOne({
            userId: userId,
            $expr: {
              $eq: [
                { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                userBodyWeightDateString,
              ],
            },
          });
        if(!weightLog)
        {
            const logcreation = await userWeightLog.create({userId:userId,userBodyWeight:userBodyWeight})
            if(!logcreation)
            {
                console.log(" Error Occure while createing log")
            }
            else
            {
                console.log(logcreation)
            }
        }
        else
        {
            if(weightLog.userBodyWeight!==userBodyWeight)
            {
                weightLog.userBodyWeight=userBodyWeight
                await weightLog.save();
            }

        }


        const metValue = metValues[exercise]?.["MET"] || 0;
        //console.log(metValue)

        let caloriesBurned = 0;
        let calculatedDuration = 0;
        let setsTime=0

        // Case 1: When 'weight', 'sets', and 'reps' 
        if (weight) 
        {
            const repTime=metValues[exercise]?.["repTime"]
           
            if(reps<5)
            {
                setsTime=(sets*reps*repTime)
            }
            else
            {
                setsTime=(sets*reps*repTime)/5
            }
            //console.log(`repTime:${repTime},setsTime:${setsTime},metValue:${metValue}`)
            if(metValues[exercise]?.["MachineExercise"])
            {
                totalWeight=weight
            }
            else
            {
                totalWeight=weight+userWeight
            }
            calculatedDuration=(setsTime)/(60*60)
            caloriesBurned=(metValue*totalWeight*calculatedDuration)

        }
        // Case 2: When 'speed' and 'distance' 
        else if (speed && distance) 
        {
            calculatedDuration = distance / speed;
            caloriesBurned = userWeight * metValue * calculatedDuration;
        }
        //case 3 : speed and Time
        else if(speed && time)
        {
            const repTime=metValues[exercise]?.["repTime"]
            calculatedDuration=(time/60)*repTime
            caloriesBurned=metValue*userWeight*calculatedDuration
        }
        else if(time)
        {
            
            calculatedDuration=time/60
            caloriesBurned=metValue*userWeight*calculatedDuration
        }
        // Case 4: Default 'sets' and 'reps' 

        else 
        {
            const repTime=metValues[exercise]?.["repTime"]
            if(reps<5)
            {
                setsTime=(sets*reps*repTime)
            }
            else
            {
                setsTime=(sets*reps*repTime)/5
            }
            
            calculatedDuration = (setsTime )/ (60 * 60); // Assuming 45 seconds per set
            caloriesBurned = metValue*userWeight*calculatedDuration;
           
        }

        // Create workout object
        const newWorkOutDetails = {
            weight: weight?weight:userWeight,
            sets: sets || 0,
            reps: reps || 0,
            speed: speed || 0,
            distance: distance || 0,
            duration:(calculatedDuration*60).toFixed(2),
            exercise: exercise,
            category:category,
            caloriesBurned: caloriesBurned===0? 0 : caloriesBurned.toFixed(2)
        };

        // Save to database
        const addedWorkOutData = await WorkoutDetails.create({...newWorkOutDetails,user: userId, userId:userId});
        if (!addedWorkOutData) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: 'Error occurred while adding data to the database.' });
        }

        return res.status(StatusCodes.CREATED).json({ success: true, data: addedWorkOutData });
    } catch (error) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ success: false, message: error.message });
    }
};


const deleteuserWorkout= async(req,res,next)=>
{
    try 
    {
        const {userId,email}=req.user
        const {workoutId}=req.params
        const result= await WorkoutDetails.findByIdAndDelete({_id:workoutId})
        if(!result)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Data is not present for provided Id, check once"})
        }
        else
        {
          return res.status(StatusCodes.OK).json({success:true,message:"Workout Record Deleted"})   
        }

    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:error.message})
    }
}

const getWorkoutHistory=async(req,res)=>
{
    try 
    {
        const {userId,email}=req.user
        //const workoutNames=await WorkoutDetails.find({userId})
        let workoutData= await WorkoutDetails.aggregate([
            {$match:{userId:userId}},
            {
                $group:
                {
                    _id:{$dateToString:{format:"%Y-%m-%d", date: "$date"}},
                    exercises: { $push:"$exercise"},
                    totalCalories: { $sum: "$caloriesBurned" }, // Sum total calories for each date
                    totalDuration: { $sum: "$duration" }
                },
            },
            { $sort: { _id: -1 } }
        ])
        
        workoutData= workoutData.map((item,index)=>(
            {
                date:item._id,
                exercises:item.exercises,
                totalCalories:Math.ceil(item.totalCalories),
                totalDuration:Math.ceil(item.totalDuration)
            }
        ))

        
        if(!workoutData)
        {
            return res.status(StatusCodes.BAD_GATEWAY).json({success:false, message:"Unable to get workhistory Data"})
        }
        //fetching userWeightLog
        const userWeightLogData= await userWeightLog.find({userId:userId})
        if(!userWeightLogData)
        {
            return res.status(StatusCodes.BAD_GATEWAY).json({success:false,message:"Unable fetch data from userWightLog"})
        }
        let userWeightLogDataFormat=userWeightLogData.map((item)=>
        ({
            _id:item._id,
            userId:item.userId,
            userBodyWeight:item.userBodyWeight,
            date:item.date.toISOString().split('T')[0]

        }))
        userWeightLogDataFormat.sort((a, b) => new Date(b.date) - new Date(a.date));
        if(!(workoutData.length===userWeightLogDataFormat.length))
        {
            console.log(`The Workout History, the workout data and userweightLog in not Equal ${workoutData.length} and ${userWeightLogDataFormat.length}`)
        }
        else
        {
            console.log(`Both are equal,WorkOut history ${workoutData.length} and ${userWeightLogDataFormat.length}`)
        }
        return res.status(StatusCodes.OK).json({success:true, workoutData,userWeightLogDataFormat})


    } 
    catch (error) 
    {
        return res.status(StatusCodes.BAD_GATEWAY).json({success:false, message:error.message})
    }
}

const deleteMulWeightLog= async(req,res)=>
{
    try
    {
        const {userId,deleteDate}=req.body
        const date=new Date(deleteDate)
        const logData=  await userWeightLog.findOne({userId:userId,
            $expr:{
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    deleteDate,
                  ],
                }
        })
        if(logData)
        {
            await userWeightLog.deleteMany({
                $expr:{
                    $eq: [
                        { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        deleteDate,
                      ],
                    },
                    _id:{$ne:logData?._id}
                
            })
            res.status(201).json({message:"UserWeightLog Data deleted SuccessFully"})
        }
        else
        {
            res.status(401).json({success:false,message:`UserWeightLog data not exists check given date ${deleteDate}`})
        }
        
    } 
    catch (error) 
    {
        res.status(502).json({success:false,message:"Error Occurs while deleting the UserWeightLog"})
    }
}




const addWorkoutLog= async(req,res,next)=>
{
    try
    {
        const {userId,userBodyWeight,date}=req.body
        let dateString=date.split('T')[0]
        const weightLog= await userWeightLog.findOne({userId:userId,
            $expr:{
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    dateString,
                  ],
                },
            })
        if(weightLog)
        {
          return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Data is available for given Data",weightLog})
        }
        else
        {
            let dateRecord=await userWeightLog.create({...req.body})
            return res.status(StatusCodes.CREATED).json({success:true,message:"Date Record Created", dateRecord})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:error.message})
    }
    
}

const removeSingleWorkout= async(req,res)=>
{
    try 
    {
        const {userId,email}= req.user
        const {workout_id} =req.params
        const deleteUserWorkout= await WorkoutDetails.findOneAndDelete({_id:workout_id})
        if(!deleteUserWorkout)
        {
            return res.status(StatusCodes.BAD_GATEWAY).json({success:false,message:`Unable to find workout data for respective id:${workout_id}`})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        }
        return res.status(StatusCodes.OK).json({sucess:true,message:"workout data deleted successfully"})
    }   
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({sucess:false,message:error.message})
    }
}

module.exports = { addWorkout ,getWorkoutHistory,addWorkoutLog,removeSingleWorkout,deleteMulWeightLog};
