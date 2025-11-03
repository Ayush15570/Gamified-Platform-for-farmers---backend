import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDailyChallenge } from "../controllers/dailyChallenge.controller.js";
const router = Router();


router.get("/daily", verifyJWT, getDailyChallenge);

export default router;
