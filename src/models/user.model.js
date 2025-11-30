import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
   
   fullName:{
    type:String,
    required:true,

   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   phoneNumber:{
       type:String,
       unique:true,
       sparse:true
   },
   phoneVerified: {
       type: Boolean,
       default: false
   },
   password:{
    type:String,
    required:true
   },
   totalPoints:{
    type:Number,
    default:0
   },
   level:{
    type:Number,
    default:1
   },
   role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  phoneOTP: {
    type: String,
},
otpExpiry: {
    type: Date,
},
refreshToken:{
        type:String
},
subscription:{
    type:String,
    enum:["free","vip"],
    default:"free"
}

   
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            fullName:this.fullName,
             phoneNumber: this.phoneNumber,
    phoneVerified: this.phoneVerified, // ✅ include this
    role: this.role, 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export  const User = mongoose.model("User",userSchema)