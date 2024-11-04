const mongoose= require('mongoose')



const whatsappMessage= new mongoose.Schema(
    {
        userId:
        {
            type:String,
        },
        userMobile:
        {
            type:String
        },
        remainderDate:
        {
            type:String
        },
        remainderTime:
        {
            type:String
        },
        senderMobile:
        {
            type:String
        },

        remainderMessage:
        {
            type:String
        },
        status:
        {
            type:String,
            default:'pending'
        },
        sendAt:
        {
            type:String
        },
        remainder:
        {
            type:Boolean,
            default:true
        }
    }
)

module.exports=mongoose.model('whatsappMessage',whatsappMessage)