import mongoose, { mongo } from "mongoose";

const userDailyChallengeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    practiceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Practise",
        required:true
    },
    date:{
        type:String,
        required:true
    },

},{timestamps:true})

export const UserDailyChallenge = mongoose.model(
    "UserDailyChallenge",
    userDailyChallengeSchema
)