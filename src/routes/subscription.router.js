
import { activateVIP,getSubscription } from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import{ Router }from "express"

const router = Router()


router.post('/activate',verifyJWT, activateVIP)
router.get("/status",verifyJWT,getSubscription)


export default router 