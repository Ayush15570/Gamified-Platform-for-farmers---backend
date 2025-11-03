import mongoose, { mongo } from "mongoose";


const UserPracticeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    practiceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Practise",
        required:true
    },
    photo:{
        type:String
    },
    pointsAwarded:{
        type:Number,
        default:0
    },
    verified:{
        type:Boolean,
        default:false
    },
    status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},
})

export const UserPractice = mongoose.model("UserPractice",UserPracticeSchema)