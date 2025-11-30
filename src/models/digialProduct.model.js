import mongoose from "mongoose"


const digitalSchema = new mongoose.Schema({
    title:{
        type:String,
        requried:true
    },
    description:{
        type:String
    },
    pointsCost:{
        type:Number,
        requried:true
    },
    fileUrl:{
        type:String
    },
    type:{
        type:String,
        default:"digital"
    }
})

export const DigitalProduct = mongoose.model("DigitalProduct",digitalSchema)