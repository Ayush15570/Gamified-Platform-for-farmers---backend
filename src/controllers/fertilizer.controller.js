import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Fertilizer } from "../models/fertilizer.model.js";

const recommendFertilizer = asyncHandler(async(req,res) => {
    const {crop,problem} = req.body;

    if(!crop || !problem){
        throw new ApiError(400,"Crop and problem req")
    }

    const fertilizers = await Fertilizer.find({
        forCrops : {$in: [ crop]},
        problem: {$in: [problem]}
       
    })

    return res
    .status(200)
    .json(new ApiResponse(200,fertilizers,"Fertiliers recommended"))

})

export {recommendFertilizer}