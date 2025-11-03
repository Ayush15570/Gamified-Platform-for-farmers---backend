import mongoose from "mongoose";

const fertilizerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    forCrops:[{
        type:String
    }],
    problem:[{
        type:String
    }],
    tips:{
     type:String
    }
})


export const Fertilizer = mongoose.model("Fertilizer",fertilizerSchema)