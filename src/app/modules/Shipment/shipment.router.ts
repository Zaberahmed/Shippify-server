import express from "express";
import { createShipment, createLabelBasedOnRateId, getAllRelevantRates, getServicePointList, updateShipmentById, addSelectedRateForShipment, getAllShipment } from "./shipment.controller";
const router = express.Router();


router.get('/all-shipment', getAllShipment);
router.post('/create', createShipment);
router.patch('/update/:id', updateShipmentById);
router.post('/rates', getAllRelevantRates);
router.patch('/select-rates', addSelectedRateForShipment);
router.post('/labels/rate-id/:id', createLabelBasedOnRateId);
router.patch('/add-drop-off-pick-up-point/:id', updateShipmentById);
router.post('/service_points/list', getServicePointList)

export default router;