import express from "express";
import {
  createLabelBasedOnRateId,
  createShipmentAndGetAllRelevantRates,
  getServicePointList,
  updateShipmentById,
  addSelectedRateForShipment,
  getAllShipment,
  cancelShipmentById,
  updateShipmentStatusId,
  getAllShipmentsGroupByMonth,
  sortByPriceAndPackage,
  groupShipmentByStatus,
  totalSuccessShipmentByMonth,
  totalFailedShipmentByMonth,
  parchedShipment,
  calculateInsurance,
} from "./shipment.controller";
import { authentication } from "../../middlewares/authentication.middleware";
const router = express.Router();

router.get("/all-shipment", authentication, getAllShipment);
router.post("/rates", authentication, createShipmentAndGetAllRelevantRates);
router.post("/service_points/list", getServicePointList);

router.patch("/update/:id", authentication, updateShipmentById);
router.put("/cancel/:shipment_id/:_id", authentication, cancelShipmentById);
router.patch("/select-rates", authentication, addSelectedRateForShipment);
router.post("/calculate-insurance/:_id", authentication, calculateInsurance);
// router.post('/create-labels/:rate_id/:_id', authentication, createLabelBasedOnRateId);
router.post("/parched-shipment/:rate_id/:_id", authentication, parchedShipment);
router.patch(
  "/add-drop-off-pick-up-point/:id",
  authentication,
  updateShipmentById
);
router.patch(
  "/update-shipment-status/:_id",
  authentication,
  updateShipmentStatusId
);

//chart
router.get(
  "/basic/chart/group/by/month",
  authentication,
  getAllShipmentsGroupByMonth
);
router.get(
  "/basic/pie/chart/group/by/shipping/status",
  authentication,
  groupShipmentByStatus
);
router.post("/basic/success", authentication, totalSuccessShipmentByMonth);
router.post("/basic/failed", authentication, totalFailedShipmentByMonth);

//sorting the shipment table by heaviest package, price,status ,label creation date
router.post(
  "/sort-by-package-and-price",
  authentication,
  sortByPriceAndPackage
);

export default router;
