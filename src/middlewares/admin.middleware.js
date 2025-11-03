import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";


export const verifyAdmin = asyncHandler(async(req,res,next) => {
    const user = await User.findById(req.user._id);

    if(!user) {
        throw new ApiError(404,"User not found")
    }
    
    if(user.role !== "admin") {
        throw new ApiError(402,"Access denied")
    }

    next();

})