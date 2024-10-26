const twilio= require('twilio')
const cron=require('node-cron')
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const whatsappMessage= require('../models/whatAppMessage')
const {StatusCodes} =require('http-status-codes');



async function sendRemainderQueue(messageData)
{
        try
        {
            const accountSid=process.env.Twilio_Account_Sid
            const authToken=process.env. Twilio_Auth_Token

            const client = new twilio(accountSid,authToken)
            const mobile="9347273270"
            const result= await client.messages.create(
                {
                    body:`${messageData.remainderMessage}, Please reply this code 'Join corner-join'`,
                    from:`whatsapp:+${messageData.senderMobile}`,
                    to:`whatsapp:+91${mobile}`
                })
            const res=JSON.stringify(result)
            console.log(`result:${res}`)   
            client.messages(result.sid)
            .fetch().then(message => console.log(message.status)); 
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



const scheduleModule= async(req,res)=>
{
    try 
    {
        const {userId,email}= req.user
        const {message, date,time,remainder}=req.body
        const mobile='7989188700'
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
        const messageData= await whatsappMessage.create(
            {
                userId:userId,
                remainderMessage:message,
                remainderDate:date,
                remainderTime:time,
                sendAt:sendAt,
                senderMobile:'14155238886',
                userMobile:mobile,
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
        const {remainder_id} = req.params
        const {remainder}=req.body
        const remainderData= await whatsappMessage.findOne({_id:remainder_id,userId:userId})
        if(!remainderData)
        {
            return res.status(StatusCodes.BAD_GATEWAY).json({success:false,message:`Remainder Data is not found for this id ${remainder_id}`})
        }
        else
        {
            if(remainder==='true')
            {
                remainderData.status='pending'
                remainderData.remainder='true'
                await remainderData.save();
            }
            else
            {
                remainderData.status='disable'
                remainderData.remainder='false'
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

