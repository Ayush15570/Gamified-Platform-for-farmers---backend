
import { DigitalProduct } from "../models/digialProduct.model.js";
import { RedeemedProduct } from "../models/Product.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getAllProducts = asyncHandler(async(req,res)=>{
   const products = await DigitalProduct.find({});
   return res
   .status(200)
   .json(new ApiResponse(200,products,"Digital products fetched"))
})

export const redeemProduct = asyncHandler(async(req,res) => {
    const userId = req.user._id;
    const {productId} = req.params;

    const product = await DigitalProduct.findById(productId)
    const user = await User.findById(userId)

    if(!product){
        return res.status(404).json(new ApiResponse(404,null,"Product not found"))
    }
    
    if(user.totalPoints < product.pointsCost) {
        return res.status(400).json(
            new ApiResponse(400,null,"Not enough points")
        )
    }

    user.totalPoints -= product.pointsCost
    await user.save();

    await RedeemedProduct.create({
        userId,
        productId,
        fileUrl: product.fileUrl
    })

    return res.status(200).json(
        new ApiResponse(200,{fileUrl: product.fileUrl},"Product redeemed successfully")
    )
})

export const getPurchasedProducts = asyncHandler(async(req,res)=> {
    const userId = req.user._id;

    const redeemed = await RedeemedProduct.find({userId})
    .populate("productId")
    .sort({ redeemedAt:-1})
    
    return res
    .status(200)
    .json(new ApiResponse(200,redeemed,"Purchased items fetched"))
})
