import {Router} from 'express'
import { loginUser,logout,registerUser,refreshAccessToken,verifyPhone, getCurrentUser, demoLogin} from '../controllers/user.controller.js'

import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/login").post(loginUser)
router.route("/registerUser").post(registerUser)
router.route("/logout").post(verifyJWT,logout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/verify-phone").post(verifyPhone)
router.route("/get-user").get(verifyJWT,getCurrentUser)
router.route("/demo-login").post(demoLogin)
export default router;