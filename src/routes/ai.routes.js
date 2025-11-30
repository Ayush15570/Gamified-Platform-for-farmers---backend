import { Router } from "express";
import multer from "multer";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyVIP } from "../middlewares/vip.middlewares.js";
import { analyzeCropIssue } from "../controllers/aiDetection.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();




router.route("/ai-crop-issue").post(verifyJWT,verifyVIP,
    upload.fields([{name:"image",maxCount:1}]),
    analyzeCropIssue
)




export default router;
