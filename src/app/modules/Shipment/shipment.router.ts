import express from "express";
import { createLabelBasedOnRateId, createShipmentAndGetAllRelevantRates, getServicePointList, updateShipmentById, addSelectedRateForShipment, getAllShipment, cancelShipmentById, updateShipmentStatusId,
     getAllShipmentsGroupByMonth,
     sortByPriceAndPackage,
     groupShipmentByStatus, 
     totalSuccessShipmentByMonth,
     totalFailedShipmentByMonth} from "./shipment.controller";
import { authentication } from "../../middlewares/authentication.middleware";
const router = express.Router();


router.get('/all-shipment',authentication, getAllShipment);
// router.post('/rates', authentication, createShipmentAndGetAllRelevantRates);
router.post('/rates', createShipmentAndGetAllRelevantRates);
router.post('/service_points/list', getServicePointList)

router.patch('/update/:id', updateShipmentById);
router.put('/cancel/:shipment_id/:_id', cancelShipmentById);
router.patch('/select-rates', addSelectedRateForShipment);
router.post('/create-labels/:rate_id/:_id', createLabelBasedOnRateId);
router.patch('/add-drop-off-pick-up-point/:id', updateShipmentById);
router.patch('/update-shipment-status/:_id', updateShipmentStatusId);

//chart
router.get('/basic/chart/group/by/month', authentication, getAllShipmentsGroupByMonth);
router.get('/basic/pie/chart/group/by/shipping/status',authentication, groupShipmentByStatus);
router.post('/basic/success',authentication, totalSuccessShipmentByMonth)
router.post('/basic/failed',authentication,totalFailedShipmentByMonth)

//sorting the shipment table by haviest package, price,status ,label creation date
router.post('/sort-by-package-and-price', authentication, sortByPriceAndPackage)



export default router;