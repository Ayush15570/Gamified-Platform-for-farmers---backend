import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { verifyPractice,getPendingPractices } from "../controllers/admin.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { UserPractice } from "../models/UserPractice.model.js";

import { CropIssue } from "../models/CropIssue.model.js";


const router = Router()

router.route("/pending-practices").get(verifyJWT,verifyAdmin,getPendingPractices)

router.route("/verify").post(verifyJWT,verifyAdmin,verifyPractice)

router.get("/stats",asyncHandler(async(req,res) =>{
    const totalUsers = await User.countDocuments();
    const totalPractices = await UserPractice.countDocuments();
    const pendingPractices = await UserPractice.countDocuments({status : "pending"})
    const approvedPractices = await UserPractice.countDocuments({status:"approved"})
    const rejectedPractices = await UserPractice.countDocuments({status : "rejected"})

    const cropIssuesReported = await CropIssue.countDocuments()
    const cropIssueResolved = await CropIssue.countDocuments({status:"resolved"})

   
  const systemHealth = Math.round((approvedPractices / Math.max(totalPractices, 1)) * 100); 

   res.json({
    
    totalUsers,
    totalPractices,
    pendingPractices,
    approvedPractices,
    rejectedPractices,
    cropIssuesReported,
    cropIssueResolved,
    systemHealth
  });
}))

export default router