import { Router } from "express";
import { getAllPractices,getUserPractices,completePractice} from "../controllers/practice.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/complete-practice").post(verifyJWT,upload.fields([
    {
        name:"photo",
        maxCount:1
    }
]),completePractice)

router.route("/").get(verifyJWT,getAllPractices)

router.route("/user").get(verifyJWT,getUserPractices)

export default router