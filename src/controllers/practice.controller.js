import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Practise } from "../models/practise.model.js";
import { UserPractice } from "../models/UserPractice.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const getAllPractices = asyncHandler(async(req,res)=>{
    const practices = await Practise.find();
    return res.status(200).json(
        new ApiResponse(200,practices,"Available practices fetched")
    )
})

const completePractice = asyncHandler(async(req,res)=>{
    const {practiceId} = req.body;
    

    if(!practiceId) throw new ApiError(400,"practiceId is required")
    
    const alreadyDone = await UserPractice.findOne({
        userId: req.user._id,
        practiceId
    })
    // Handle photo upload
    const photoLocalPath = req.files?.photo?.[0]?.path;
    if (!photoLocalPath) {
        throw new ApiError(400, "Photo is required");
    }

    const uploadedPhoto = await uploadOnCloudinary(photoLocalPath);
    if (!uploadedPhoto) {
        throw new ApiError(500, "Failed to upload photo");
    }

    if(alreadyDone) throw new ApiError(400,"Practice already completed")

    const userPractice = await UserPractice.create({
        userId:req.user._id,
        practiceId,
        photo :  uploadedPhoto.url,
    });

    return res.status(201).json(
    new ApiResponse(201, userPractice, "Practice completed successfully with proof")
  );

})

const getUserPractices = asyncHandler(async(req,res) => {
    const completedPractices = await UserPractice.find({
        userId:req.user._id
    }).populate("practiceId")

    return res.status(200).json(
        new ApiResponse(200,completedPractices,"User practices fetched")
    )

})

export {
    getAllPractices,
    getUserPractices,
    completePractice
}