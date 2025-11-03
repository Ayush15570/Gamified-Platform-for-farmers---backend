import mongoose, { mongo } from "mongoose";
import { Practise } from "./practise.model";

const taskSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    Practise:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Practise",
        required:true
    },
    status:{
        type:String,
        enum:["pending","completed"],
        default:"pending"
    }
},{timestamps:true})

export const Task = mongoose.model("Task",taskSchema)