const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')

const RegisterSchema= mongoose.Schema({
    userName:{
        type:String,
        required:[true,'Name is mandatory'],
        maxlength:[50, `full can't be more than 50 letters`]
    },
    email:
    {
        type:String,
        required:[true,'Email is mandatory'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique:true,
    },
    password:
    {
        type:String,
        required:[true, 'Please Enter Password'],
        maxlength:200
    }

},{timestamps:true})

RegisterSchema.pre('save', async function(next){
    const saltRounds=10;
    this.password= await bcrypt.hash(this.password,saltRounds);
    next();
})

RegisterSchema.methods.comparePassword = async function(passkey) 
{
  const ismatch=await bcrypt.compare(passkey,this.password)
  //console.log(ismatch);
  return ismatch; 
}

//Generate JWT Token

RegisterSchema.methods.createJWT= function()
{
    const token=jwt.sign(
        {userId:this._id,email:this.email},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_LIFETIME}
    )
    return token
}

module.exports=mongoose.model('RegisterDetails',RegisterSchema);