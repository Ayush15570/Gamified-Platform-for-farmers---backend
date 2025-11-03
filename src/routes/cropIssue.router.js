import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  reportCropIssue,
  getAllCropIssues,
  getUserCropIssues,
  resolveCropIssue,
} from "../controllers/cropIssue.controller.js";

const router = Router();

// User reports crop issue
router
  .route("/report")
  .post(
    verifyJWT,
    upload.fields([{ name: "image", maxCount: 1 }]),
    reportCropIssue
  );

// Admin views all crop issues
router.route("/all").get(verifyJWT, verifyAdmin, getAllCropIssues);

// Admin resolves an issue
router.route("/resolve").post(verifyJWT, verifyAdmin, resolveCropIssue);

router.route("/my-issues").get(verifyJWT,getUserCropIssues)

export default router;
