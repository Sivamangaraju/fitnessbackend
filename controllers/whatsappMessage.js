const twilio= require('twilio')
const cron=require('node-cron')
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const whatsappMessage= require('../models/whatAppMessage')
const UserProfile=require('../models/profileData')
const {StatusCodes} =require('http-status-codes');



async function sendRemainderQueue(messageData,mobile,sendRemainder='false')
{
        try
        {
            const accountSid=process.env.Twilio_Account_Sid
            const authToken=process.env. Twilio_Auth_Token
            const client = new twilio(accountSid,authToken)
            if(messageData)
            {
                console.log(`Sender Mobile:${messageData.senderMobile}`)
                //const dummyMobile="9347273270"
                const result= await client.messages.create(
                    {
                        body:`#Update from FitNest🤷:${messageData.remainderMessage}'`,
                        from:`whatsapp:+${messageData.senderMobile}`,
                        to:`whatsapp:+91${messageData.userMobile}`
                    })
                const res=JSON.stringify(result)
                console.log(`result:${res}`)   
                client.messages(result.sid).fetch().then(message => console.log(message.status)); 
            
                if(!result)
                {
                  console.log("Error occur while create a message in twilio")
                  return false
                }
                messageData.status='sent'
                await messageData.save();   
                console.log("Message Send Successfully")
                return true

            }
            if(sendRemainder==='true')
            {
                //const twilioNumber='14155238886'
                const result= await client.messages.create(
                    {
                        body:`twilio session is gonna expires in 1 hours, please send a message like this "Join corner-join"`,
                        from:'whatsapp:+14155238886',
                        to:`whatsapp:+91${mobile}`
                    })
                const res=JSON.stringify(result)
                console.log(`result:${res}`)   
                client.messages(result.sid).fetch().then(message => console.log(message.status)); 
            
                if(!result)
                {
                  console.log("Error occur while sending session message in twilio")
                  return false
                }
                console.log("Session Remainder  Send Successfully")
                return true
            }
            
        } 
        catch (error) 
        {
            console.log('Error occurs while creating or sending message in twilio:', error.message)
            return false
        }
}


cron.schedule('* * * * *',async()=>{
    try 
    {
     const curr= new Date();
     dayjs.extend(utc);
     dayjs.extend(timezone);
     const currDate= dayjs.tz(curr,'Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss')
     const messageDataList= await whatsappMessage.find({status:'pending',sendAt:{$lte:currDate}})
     if(messageDataList?.length>0)
     {
        for(const messageData of messageDataList)
        {
            const result= await sendRemainderQueue(messageData);
            
            if(!result)
            {
                console.log(`Failed to send message for ${messageData.to}`)
            }
        }
     }
    else
    {
    console.log("MessageData List is Empty")
    }
    } 
    catch (error) 
    {
        console.error('Error while fetching/sending messages:', error.message);
    }
})

const cronJob= async()=>
    {
    try 
    {
     const curr= new Date();
     dayjs.extend(utc);
     dayjs.extend(timezone);
     const currDate= dayjs.tz(curr,'Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss')
     //get all user mobile numbers from profile
     const getAllUserMobiles= await UserProfile.find({},'userMobile');
     const userMobiles= getAllUserMobiles.map(item=>item.userMobile);
     if(userMobiles.length>0)
     {
        for(const item in userMobiles)
        {
            const result= await sendRemainderQueue(null,item,true);
            if(!result)
                {
                   console.log(`Unable to send Session Remainder to User`)
                }
            else
                {
                   console.log('Session Remainder send Successfully')
                }
        }
     }
    }
    catch (error) 
    {
        console.error('Error while fetching/sending messages:', error.message);
    }
}
cronJob()
setInterval(cronJob,22 * 60 * 60 * 1000);


const scheduleModule= async(req,res)=>
{
    try 
    {
        const {userId,email}= req.user
        const {message, date,time,remainder}=req.body
        //const mobile='7989188700'
        let timeSplit= time.split(' ')[1]
        let timeMin= time.split(' ')[0]
        let [hours,minutes]= timeMin.split(':').map(Number)

        if(timeSplit==="PM" && hours!==12)
        {
            hours+=12
        }
        else if(timeSplit==="AM" && hours===12)
        {
            hours=0;
        }
        let finalTime= `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`
        const dateTime=`${date}T${finalTime}:00`
        dayjs.extend(utc);
        dayjs.extend(timezone);
        const sendAt=dayjs.tz(dateTime,'Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss')
        console.log(`previous Date: ${sendAt}`)
        //Fetch User Profile
        const profile= await UserProfile.findOne({userId}).exec()
        if (profile.userMobile==null)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"userMobile is null, update Profile mobile Data"})
        }
        const messageData= await whatsappMessage.create(
            {
                userId:userId,
                remainderMessage:message,
                remainderDate:date,
                remainderTime:time,
                sendAt:sendAt,
                senderMobile:'14155238886',
                userMobile:profile.userMobile,
                remainder:remainder
            })
            console.log(`DB date: ${messageData.sendAt}`)
        if(!messageData)
            {
                return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Message is Unable to scheduled"})
            }    
        return res.status(StatusCodes.CREATED).json({success:true, message:"message scheduled successfully"})

    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:error.message})
    }
}

const getTotalReminders=async(req,res)=>
{

    try 
    {
        const {userId, email}= req.user
        dayjs.extend(utc);
        dayjs.extend(timezone);
        const currDate= new Date();
        const indiaDate=dayjs.tz(currDate,'Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss')
       
        const planData= await whatsappMessage.find({
            userId:userId,
            status:{$ne:'sent'},
            sendAt:{$gte:indiaDate}
        }).exec()
        if(!planData)
        {
            return res.status(StatusCodes.BAD_GATEWAY).json({suceess:false, message:"Remainder's Data is Empty"})
        }
        return res.status(StatusCodes.OK).json({success:true,planData})

        
    }
    catch (error) 
    {
        return res.status(StatusCodes.OK).json({success:false, message:error.message})   
    }
}


const modifyRemainder= async(req,res)=>
{
    try
    {
        const {userId,email}=req.user
        const {remainderId} = req.params
        const {remainder}=req.body
        const remainderData= await whatsappMessage.findOne({_id:remainderId,userId:userId})
        if(!remainderData)
        {
            return res.status(StatusCodes.BAD_GATEWAY).json({success:false,message:`Remainder Data is not found for this id ${remainderId}`})
        }
        else
        {
            if(remainder===true)
            {
                remainderData.status='pending'
                remainderData.remainder=true
                await remainderData.save();
            }
            else
            {
                remainderData.status='disable'
                remainderData.remainder=false
                await remainderData.save();
            }
            return res.status(StatusCodes.CREATED).json({success:true,remainderData,message:"Remainder Updated Successfully"})
        }

    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:error.message})    
    }
}


module.exports={sendRemainderQueue,scheduleModule,getTotalReminders,modifyRemainder}

