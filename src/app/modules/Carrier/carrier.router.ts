import express from "express";
import { carrierServices, getAllCarriers, packagesServices } from "./carrier.controller";
const router = express.Router();

router.get('/list', getAllCarriers)
router.get('/service/:id', carrierServices)
router.get('/package-type/:id', packagesServices)

export default router;