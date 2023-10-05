import express from "express";
import {
  createBOL,
  createQuote,
  getAllLtlShipment,
  getLtlCarrierDetail,
  calculateLTLInsurance,
  parchedLTLShipment,
  filterOutReceivedShipments
} from "./ltlShipment.controller";
import { authentication } from "../../middlewares/authentication.middleware";
const router = express.Router();

// authentication ----> authUser
router.get("/my-shipment-list", authentication, getAllLtlShipment);
router.get("/without-received-ltl-shipments", authentication, filterOutReceivedShipments)
router.get("/carrier-detail", authentication, getLtlCarrierDetail);
router.post("/request-for-quote", authentication, createQuote);
router.post("/create-BOL", authentication, createBOL);
router.post("/calculate-ltlinsurance/:_id", authentication, calculateLTLInsurance);
router.post("/parched-shipment/:_id", authentication, parchedLTLShipment);

export default router;
