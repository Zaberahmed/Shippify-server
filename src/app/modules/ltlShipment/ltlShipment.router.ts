import express from "express";
import { createBOL, createQuote, getAllLtlShipment, getLtlCarrierDetail } from "./ltlShipment.controller";
import { authentication } from "../../middlewares/authentication.middleware";
const router = express.Router();

// authentication ----> authUser
router.get('/my-shipment-list', authentication, getAllLtlShipment);
router.get('/carrier-detail', authentication, getLtlCarrierDetail);
router.post('/request-for-quote', authentication, createQuote);
router.post('/create-BOL', authentication, createBOL);

export default router;