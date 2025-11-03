import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserPractice } from "../models/UserPractice.model.js";
import { User } from "../models/user.model.js";

const getPendingPractices = asyncHandler(async(req,res) => {
    const pending = await UserPractice.find({status:"pending"})
    .populate("userId","fullName phoneNumber")
    .populate("practiceId","title description");

    return res
    .status(200)
    .json(new ApiResponse(200,pending,"Pending practices fetched"))
})

const verifyPractice = asyncHandler(async(req,res)=>{
    const {userPracticeId,action,points} = req.body

    const userPractice = await UserPractice.findById(userPracticeId)
    if(!userPractice) throw new ApiError(404,"Practice not found")

    if(userPractice.status !== "pending"){
        throw new ApiError(400,"Practice already verified")
    }

    if(action === "approved"){
        userPractice.status = "approved";
        userPractice.pointsAwarded = points || 10;
        await userPractice.save();


      await User.findByIdAndUpdate(userPractice.userId,{
        $inc : {totalPoints: userPractice.pointsAwarded}
      })
    
      return res.status(200)
      .json(new ApiResponse(200,userPractice,"Practice approved"))
    }else if(action === "reject"){
        userPractice.status = "rejected";
        await userPractice.save()

        return res.status(200)
        .json(new ApiResponse(200,userPractice,"Practice rejected"))
    }else{
        throw new ApiError(400,"Invalid action")
    }
})

export {getPendingPractices,verifyPractice}