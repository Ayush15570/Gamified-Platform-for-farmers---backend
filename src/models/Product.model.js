import mongoose, { mongo } from "mongoose";

const redeemedProductSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"DigitalProduct",
        required:true,
    },
    fileUrl:{
        type:String,
        required:true
    },
    redeemedAt:{
      type:Date,
      default:Date.now()
    }
})

export const RedeemedProduct = mongoose.model("RedeemedProduct",redeemedProductSchema)