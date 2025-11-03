import { Practise } from "../models/practise.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getDailyChallenge = asyncHandler(async (req, res) => {
  const dailyPractices = await Practise.find({ isDaily: true });

  if (!dailyPractices.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No daily challenges available"));
  }

  // Get today's date number (1–31)
  const today = new Date();
  const dayIndex = today.getDate() % dailyPractices.length;

  // Select challenge deterministically based on date
  const challenge = dailyPractices[dayIndex];

  return res.status(200).json(
    new ApiResponse(200, challenge, "Today's daily challenge fetched successfully")
  );
});
