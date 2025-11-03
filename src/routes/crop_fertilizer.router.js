import { Router } from "express";
import { recommendCrops } from "../controllers/crop.controller.js";
import { recommendFertilizer } from "../controllers/fertilizer.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router();

router.route("/crop").post(verifyJWT,recommendCrops)
router.route("/fertilizer").post(verifyJWT,recommendFertilizer)

export default router