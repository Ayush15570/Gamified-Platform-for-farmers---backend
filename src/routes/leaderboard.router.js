import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLeaderboard, getUserRank } from "../controllers/leaderboard.controller.js";

const router = Router();

router.get("/global", getLeaderboard); 
router.get("/my-rank", verifyJWT, getUserRank); 

export default router;
