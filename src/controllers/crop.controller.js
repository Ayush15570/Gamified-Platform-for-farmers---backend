import {asyncHandler} from "../utils/asyncHandler.js"

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Crop } from "../models/crop.model.js";

const recommendCrops = asyncHandler(async(req,res)=> {
    const {landType,waterNeeds,season} = req.body

    if(!landType || !waterNeeds || !season){
        throw new ApiError(400,"All fields are required")
    }

   const crops = await Crop.find({
  landType: { $in: [landType] },
  waterNeeds: { $in: [waterNeeds] },
  season: { $in: [season] }
});


    return res
    .status(200)
    .json(new ApiResponse(200,crops,"Crops recommended"))

})

export {recommendCrops}
