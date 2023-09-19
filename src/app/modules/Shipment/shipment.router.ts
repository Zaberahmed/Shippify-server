import express from "express";
import { createShipment, createLabelBasedOnRateId, getAllRelevantRates, getServicePointList, updateShipmentById } from "./shipment.controller";
const router = express.Router();

router.post('/create', createShipment);
router.put('/update/:id', updateShipmentById);
router.post('/rates', getAllRelevantRates);
router.post('/labels/rate-id/:id', createLabelBasedOnRateId);
router.post('/service_points/list', getServicePointList)

export default router;