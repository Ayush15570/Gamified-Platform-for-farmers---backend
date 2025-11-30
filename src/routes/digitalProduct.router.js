import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllProducts,redeemProduct,getPurchasedProducts } from "../controllers/digitalProduct.controller.js";


const router = Router()

router.get("/",verifyJWT,getAllProducts)
router.post("/redeem/:productId",verifyJWT,redeemProduct)
router.get("/purchased",verifyJWT,getPurchasedProducts)

export default router