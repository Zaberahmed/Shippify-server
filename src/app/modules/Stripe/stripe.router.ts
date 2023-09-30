import express from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { pay } from "./stripe.controller";
const router = express.Router();

router.post('/create-checkout-session',pay)



export default router;