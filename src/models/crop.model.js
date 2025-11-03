import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    landType:[{
        type:String
    }],
    waterNeeds:[{
        type:String
    }],
    season:[{
        type:String
    }],
    tips:{
        type:String
    },
    suitableStates:[{
        type:String
    }]



})


export const Crop = mongoose.model("Crop",cropSchema)