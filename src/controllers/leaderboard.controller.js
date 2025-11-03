import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


const getLeaderboard = asyncHandler(async(req,res) => {
    const topUsers = await User.find({},"fullName email totalPoints")
    .sort({totalPoints:-1})
    .limit(10);

    return res
    .status(200)
    .json(new ApiResponse(200,topUsers,"Leaderboard fetched"))
});

const getUserRank = asyncHandler(async(req,res) => {
    const users = await User.find().sort({ totalPoints: -1 });


    const rank = users.findIndex((u) => u._id.toString() === req.user._id.toString()) + 1;

     return res.status(200).json(
    new ApiResponse(200, { rank, totalUsers: users.length }, "User rank fetched")
  );
})

export { getLeaderboard, getUserRank };