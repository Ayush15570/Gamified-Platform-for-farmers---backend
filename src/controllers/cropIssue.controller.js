import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CropIssue } from "../models/CropIssue.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


 
export const reportCropIssue = asyncHandler(async (req, res) => {
  const { description } = req.body;

  if (!description) {
    throw new ApiError(400, "Description is required");
  }


  const imageLocalPath = req.files?.image?.[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const uploadedImage = await uploadOnCloudinary(imageLocalPath);
  if (!uploadedImage) {
    throw new ApiError(500, "Failed to upload image");
  }

 
  const issue = await CropIssue.create({
    userId: req.user._id,
    description,
    imageUrl: uploadedImage.url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, issue, "Crop issue reported successfully"));
});


export const getAllCropIssues = asyncHandler(async (req, res) => {
  const issues = await CropIssue.find().populate("userId", "fullName phoneNumber");

  return res
    .status(200)
    .json(new ApiResponse(200, issues, "All issues fetched successfully"));
});


export const resolveCropIssue = asyncHandler(async (req, res) => {
  const { issueId, adminResponse } = req.body;

  if (!issueId || !adminResponse) {
    throw new ApiError(400, "Both issueId and adminResponse are required");
  }

  const issue = await CropIssue.findById(issueId);
  if (!issue) throw new ApiError(404, "Issue not found");
  if (issue.status === "resolved") {
  throw new ApiError(400, "This issue is already resolved");
}


  issue.status = "resolved";
  issue.adminResponse = adminResponse;
  await issue.save();

  return res
    .status(200)
    .json(new ApiResponse(200, issue, "Crop issue resolved successfully"));
});



export const getUserCropIssues = asyncHandler(async(req,res) => {

    
   const issues = await CropIssue.find({userId:req.user._id})
   .sort({createdAr:-1})

   return res
   .json(new ApiResponse(200,issues,"User issues fetched"))

  
})