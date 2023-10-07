import express from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { bnplPaymentController, pay } from "./stripe.controller";
const router = express.Router();

router.post('/create-checkout-session',pay);
router.get('/order/upcoming-payments/user-id', authentication, bnplPaymentController);


export default router;