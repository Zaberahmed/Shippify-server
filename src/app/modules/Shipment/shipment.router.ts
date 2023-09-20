import express from "express";
import { createLabelBasedOnRateId, createShipmentAndGetAllRelevantRates, getServicePointList, updateShipmentById, addSelectedRateForShipment, getAllShipment, cancelShipmentById, updateShipmentStatusId } from "./shipment.controller";
const router = express.Router();


router.get('/all-shipment', getAllShipment);
router.post('/rates', createShipmentAndGetAllRelevantRates);
router.post('/service_points/list', getServicePointList)

router.patch('/update/:id', updateShipmentById);
router.put('/cancel/:shipment_id/:_id', cancelShipmentById);
router.patch('/select-rates', addSelectedRateForShipment);
router.post('/create-labels/:rate_id/:_id', createLabelBasedOnRateId);
router.patch('/add-drop-off-pick-up-point/:id', updateShipmentById);
router.patch('/update-shipment-status/:_id', updateShipmentStatusId);

export default router;