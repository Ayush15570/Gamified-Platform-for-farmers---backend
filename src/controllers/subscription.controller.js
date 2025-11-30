import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


export const activateVIP = asyncHandler(async(req,res) => {
    
    
    const user = await User.findById(req.user._id)
    if(!user) throw new ApiError(404,"User not found")
    
    if(user.subscription === "vip"){
        return res
        .status(400)
        .json(new ApiResponse(400,null,"You are already a VIP user"))
    }

    if(user.totalPoints < 10) {
        return res
        .status(400)
        .json(new ApiResponse(400,null,"Not enough Points"))
    }

    user.totalPoints -= 10;
    user.subscription = "vip";
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200,user,"VIP subscription activated"))
  
})

export const getSubscription = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id)

    return res
    .status(200)
    .json(new ApiResponse(200,{subscription: user.subscription}))
})