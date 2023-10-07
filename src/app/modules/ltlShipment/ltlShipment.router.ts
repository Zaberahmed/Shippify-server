import express from "express";
import {
  createBOL,
  createQuote,
  getAllLtlShipment,
  getLtlCarrierDetail,
  calculateLTLInsurance,
  parchedLTLShipment,
  getLTLShipmentDetailById,
  filterOutReceivedShipments,
  getDifferentPackageLtl
} from "./ltlShipment.controller";
import { authentication } from "../../middlewares/authentication.middleware";
const router = express.Router();

// authentication ----> authUser
router.get(
  "/my-shipment-list",
  authentication,
  getAllLtlShipment
);
router.get(
  "/ltl-shipment-detail/:_id",
  authentication,
  getLTLShipmentDetailById
);
router.get("/without-received-ltl-shipments", authentication, filterOutReceivedShipments)
router.get("/carrier-detail", authentication, getLtlCarrierDetail);
router.post("/request-for-quote", authentication, createQuote);
router.post("/create-BOL", authentication, createBOL);
router.post(
  "/calculate-ltlinsurance/:_id",
  authentication,
  calculateLTLInsurance
);
router.post("/parched-shipment/:_id", authentication, parchedLTLShipment);

//charts
router.get("/each/month/package/number", authentication,getDifferentPackageLtl)

export default router;
