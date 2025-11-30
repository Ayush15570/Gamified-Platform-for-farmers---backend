import { Practise } from "../models/practise.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserDailyChallenge } from "../models/userDailyChallenge.model.js";

export const getDailyChallenge = asyncHandler(async (req, res) => {
  
  const userId = req.user._id;
  const today = new Date().toDateString();


   let existing = await UserDailyChallenge.findOne({ userId, date: today })
  .populate("practiceId");

   if(existing){
    return res.status(200).json(
      new ApiResponse(200,existing.practiceId,"Today daily challenge")
    )

   }
  
  const dailyPractices = await Practise.find({ isDaily : true})  
  if (!dailyPractices.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No daily challenges available"));
  }

  const index = Math.floor(Math.random() * dailyPractices.length)

  const selected = dailyPractices[index]

  const newEntry = await UserDailyChallenge.create({
    userId,
    practiceId : selected._id,
    date:today
  })

  return res.status(200).json(
    new ApiResponse(200,selected,"Todays challenge fetched")
  )

});
