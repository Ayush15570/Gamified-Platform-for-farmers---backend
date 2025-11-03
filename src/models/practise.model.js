import mongoose from "mongoose"


const practiseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    points:{
        type:Number,
        default:10
    },
    isDaily: {
      type: Boolean,
      default: false, 
    },
    
},{timestamps:true})

export const Practise = mongoose.model("Practise",practiseSchema)