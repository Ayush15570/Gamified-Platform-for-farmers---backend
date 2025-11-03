import mongoose from "mongoose";

const cropIssueSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    imageUrl:{
        type:String
    },
    description:{
        type:String,
        required : true
    },
    status:{
        type:String,
        enum:["pending","resolved"],
        default:"pending"
    },
    adminResponse:{
        type:String,
        default:""
    }
    
},{timestamps:true})

export const CropIssue = mongoose.model("CropIssue",cropIssueSchema)