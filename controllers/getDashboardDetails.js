const WorkoutDetails  = require('../models/workout');
const UserProfile = require('../models/profileData');
const RegisterDetails = require('../models/register');
const streekData= require('../models/streekCount')
const userWeightLog=require('../models/userWightLog')
const {StatusCodes}=require("http-status-codes")


const getUserDashboard=async( req,res,next)=>
{
    try 
    {
      const {userId,email}=req.user 
      const user=  await RegisterDetails.findOne({email}).exec()
        
      if(!user)
      {
        return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"user not found"})
      }
      const currDate= new Date();

      const startToday=new Date(
        currDate.getFullYear(),
        currDate.getMonth(),
        currDate.getDate()
      )

      const endToday= new Date
      (
        currDate.getFullYear(),
        currDate.getMonth(),
        currDate.getDate()+1
      )
      //total calories burnt
      const totalCaloriesBurnt=await WorkoutDetails.aggregate([
        {$match:{userId:userId,date: {$gte:startToday,$lt:endToday}}},
        {
          $group:
          { 
            _id:null,
            totalCaloriesBurnt:{$sum:"$caloriesBurned"},
          },
        }
      ])
      // calculate the percentage differnce for toatal Calories Burnt
      const startYesterday=new Date()
      startYesterday.setDate(startYesterday.getDate()-1);
      startYesterday.setHours(0,0,0,0);

      const endYesterday=new Date()
      endYesterday.setDate(endYesterday.getDate()-1);
      endYesterday.setHours(23,59,59,999);

      const previousDayCalories= await WorkoutDetails.aggregate(
        [
          {$match:{userId:userId,date:{$gte:startYesterday,$lte:endYesterday}}},
          {
            $group:{
              _id:null,
              yesterdayTotalCalories:{$sum:"$caloriesBurned"}
            }
          }
        ]
      );
      const totalCaloriesToday=totalCaloriesBurnt[0]?.totalCaloriesBurnt || 0;
      const totalCaloriesYesterday= previousDayCalories[0]?.yesterdayTotalCalories || 0;
      //console.log(totalCaloriesYesterday)
      let totalCaloriesBurntPercen=0
      if(totalCaloriesYesterday===0)
      {
        if(totalCaloriesToday)
        {
          totalCaloriesBurntPercen=100
        }
      }
      else
      {
        totalCaloriesBurntPercen=((totalCaloriesToday-totalCaloriesYesterday)/totalCaloriesYesterday)*100

      }
      //console.log(`totalCaloriesBurntPerce: ${totalCaloriesBurntPercen}`)
      
      //Calculate total no of workouts
      const totalworkouts= await WorkoutDetails.countDocuments(
        {
          userId:userId,
          date:{$gte:startToday,$lt:endToday}
        }
      );

      //percentage difference for total workouts
      const totalWorkoutsYesterday= await WorkoutDetails.countDocuments(
        {
          userId:userId,
          date:{$gte:startYesterday,$lte:endYesterday}
        }
      )

      const TotalWorkoutsToday=  totalworkouts===0? 0: totalworkouts
      const TotalWorkoutsYesterday= totalWorkoutsYesterday===0 ? 0: totalWorkoutsYesterday
      let totalWorkoutsPercen=0

      if(TotalWorkoutsYesterday===0)
      {
        if(TotalWorkoutsToday)
        {
          totalWorkoutsPercen=100
        }
      }
      else
      {
        totalWorkoutsPercen=((TotalWorkoutsToday-TotalWorkoutsYesterday)/TotalWorkoutsYesterday)*100
      }


      //calculate average calories burnt per workout
      const avgCaloriesPerWorkOut= totalCaloriesBurnt[0]?.totalCaloriesBurnt/totalworkouts || 0;
      //console.log(`avgCaloriesPerWorkOut:${avgCaloriesPerWorkOut}`)
      let avgCaloriesPerWorkOutYesterday;
      if(totalCaloriesYesterday===0 && TotalWorkoutsYesterday===0)
      {
        avgCaloriesPerWorkOutYesterday=0
      }
      else
      {
        avgCaloriesPerWorkOutYesterday= (totalCaloriesYesterday/TotalWorkoutsYesterday)
      }
      
      //console.log(`avgCaloriesPerWorkOutYesterday:${avgCaloriesPerWorkOutYesterday}`)
      let avgCaloriesPerWorkoutPercen=0
      if(avgCaloriesPerWorkOutYesterday===0)
      {
        if(avgCaloriesPerWorkOut)
        {
          avgCaloriesPerWorkoutPercen=100
          
        }
      }
      else
      {
        avgCaloriesPerWorkoutPercen=((avgCaloriesPerWorkOut-avgCaloriesPerWorkOutYesterday)/avgCaloriesPerWorkOutYesterday)*100
      }
      //console.log(`avgCaloriesPerWorkoutPercen:${avgCaloriesPerWorkoutPercen}`)


      // calculate the every workout that belongs to user
      const allWorkOutData=await WorkoutDetails.countDocuments(
        {
          userId:userId
        }
      )          

      //fetch workout by category
      const caloriesByCategory= await WorkoutDetails.aggregate([
        {$match: {userId:userId, date: {$gte:startToday,$lt:endToday}}},
        {
          $group:
          {
            _id:"$category",
           totalCaloriesBurnt:{$sum:"$caloriesBurned"} 
          }
        }
      ])

      // pie chart data
      const pieChartData= caloriesByCategory.map((item,index)=>
      ({
        id:index,
        value:parseFloat(item.totalCaloriesBurnt.toFixed(2)),
        label:item._id
      }))

      //for weekly data fetching
      const weeks=[]
      const dayWiseCalories=[]
      for(let i=6;i>=0;i--)
      {
        const date=new Date(
          currDate.getTime()- i*24*60*60*1000
        );
        const day=date.getDay()
        switch(day)
        {
          case 0:
            weeks.push("Sun")
            break;
          case 1:
              weeks.push("Mon")
              break;
          case 2:
              weeks.push("Tue")
              break;
          case 3:
              weeks.push('Wed')
              break;
          case 4:
              weeks.push('Thu')
              break;            
          case 5:
              weeks.push('Fri')
              break;
          case 6:
              weeks.push('Sat')
              break;    
          default:
            console.log("Invalid day entered")    

        }
        
        const startingDay= new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        )

        const endingDay= new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()+1
        )
        const weekData= await WorkoutDetails.aggregate([
          {
            $match:{
              userId:userId,
              date:{$gte:startingDay,$lt:endingDay}
            },
          },
          {
            $group:
            {
              _id:{$dateToString :{format :"%Y-%m-%d",date:"$date"}},
              totalCaloriesBurnt:{$sum:"$caloriesBurned"}
            }
          }
        ])
        const DayWiseCalories=parseFloat(weekData[0]?.totalCaloriesBurnt.toFixed(2)) || 0
        dayWiseCalories.push(DayWiseCalories)
      }
      //streek value 
      let todayDate=new Date()
      //let nextDate=null;
      let todayDateString=todayDate.toISOString().split('T')[0];
      let streekValue=await streekData.findOne({userId}).exec()
      if(!streekValue)
      {
        streekValue=await streekData.create({userId:userId})
        console.log("Streek Data Created")
      }
      if(!totalWorkoutsYesterday)
      {
        streekValue.streekCount=0;
        streekValue.nextDate=null;
        await streekValue.save();
      }

      if(totalworkouts>0)
       {
          if(!streekValue?.nextDate)
            {
              const tomorrow=new Date();
              tomorrow.setDate(todayDate.getDate()+1);
              nextDate=tomorrow.toISOString().split('T')[0];
              streekValue.streekCount+=1;
              streekValue.nextDate=nextDate;
              await streekValue.save();
            }
            else if(todayDateString===streekValue.nextDate)
              {
                const tomorrow=new Date();
                tomorrow.setDate(todayDate.getDate()+1);
                nextDate=tomorrow.toISOString().split('T')[0];
                streekValue.streekCount+=1;
                streekValue.nextDate=nextDate;
                await streekValue.save();
              }
           
          else
          {
            console.log("Streek value is already added")
          }  
          
       }
       if(!totalWorkoutsYesterday)
       {
        const yesterdayDate=new Date();
        yesterdayDate.setDate(todayDate.getDate()-1);
        let yesterDateString=yesterdayDate.toISOString().split('T')[0];
        const dateData= await WorkoutDetails.findOne({userId:userId,date:yesterDateString})
        const profile= await UserProfile.findOne({userId:userId}).exec()
        if(!dateData)
        {
          const newWorkOutDetails = {
            weight: profile.weight,
            sets: 0,
            reps: 0,
            speed: 0,
            distance: 0,
            duration:0,
            exercise: null,
            category:null,
            caloriesBurned: 0,
            date:yesterdayDate.setDate(todayDate.getDate()-1)
            }
          const addedWorkOutData = await WorkoutDetails.create({...newWorkOutDetails,user: userId, userId:userId});
        }
        const weightLogData= await userWeightLog.findOne({userId:userId,date:yesterDateString})
        if(!weightLogData)
        {
          const weightLog=
        {
          userId:userId,
          userBodyWeight:profile.weight,
          date:yesterdayDate.setDate(todayDate.getDate()-1)
        }
        await userWeightLog.create({...weightLog})
        
       }
      }
                    
    return res.status(StatusCodes.OK).json(
                      { success:true, 
                        totalCaloriesBurnt:parseFloat(totalCaloriesBurnt[0]?.totalCaloriesBurnt.toFixed(2)) || 0,
                        totalCaloriesBurntPercen:totalCaloriesBurntPercen===0? 0 : Math.ceil(totalCaloriesBurntPercen),

                        totalworkouts:totalworkouts,
                        totalWorkoutsPercen:totalWorkoutsPercen===0? 0 : parseFloat(totalWorkoutsPercen.toFixed(2)),

                        avgCaloriesPerWorkOut:avgCaloriesPerWorkOut===0? 0 : parseFloat(avgCaloriesPerWorkOut.toFixed(2)) ,
                        avgCaloriesPerWorkoutPercen:Math.ceil(avgCaloriesPerWorkoutPercen),

                        weeklyCaloriesBurnt:
                        {
                          weeks:weeks,
                          dayWiseCalories:dayWiseCalories,
            
                        },
                        usertotalWorkOuts:allWorkOutData,
                        pieChartData:pieChartData,
                        streekCount:streekValue.streekCount
                      })

    } catch (error) 
    {

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:error.message})
        
    }

}

const todayWorkoutData= async(req,res,next)=>
{
  try 
  {
    const {userId,email}=req.user
    const user=await RegisterDetails.findOne({email}).exec();
    let date=new Date()
    if(!user)
      {
        return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"User not found"})
      }
      const startingDay=new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
      const endindDay=  new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()+1
      )
      const todayTotalWorkoutData= await WorkoutDetails.find({
        userId:userId,
        date:{$gte:startingDay,$lt:endindDay},

      });

      let totalCalories= todayTotalWorkoutData.reduce((res,item)=>
      res+item.caloriesBurned,0)
      totalCalories=totalCalories===0? 0 : totalCalories.toFixed(2)

      return res.status(StatusCodes.OK).json({success:true,todayTotalWorkoutData,totalCalories,count:todayTotalWorkoutData.length})


  } 
  catch (error) 
  {
    return res.status(StatusCodes.BAD_GATEWAY).json({success:false,message:error.message})  
  }
}



module.exports={getUserDashboard,todayWorkoutData}