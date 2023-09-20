import express from "express";
import { createQuote, getAllLtlShipment, getLtlCarrierDetail } from "./ltlShipment.controller";
const router = express.Router();

// router.get('/all-ltlShipment', getAllLtlShipment);
router.get('/detail', getLtlCarrierDetail);
router.post('/request-for-quote', createQuote);
// router.post('/rates', createShipmentAndGetAllRelevantRates);
// router.post('/service_points/list', getServicePointList)
// router.patch('/update/:id', updateShipmentById);

export default router;