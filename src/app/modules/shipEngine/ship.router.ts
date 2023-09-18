import express from "express";
import { addFundsToCarrier, getAllShip } from "./ship.controller";
const router = express.Router();

router.get('/all-list', getAllShip);
router.post('/add-fund', addFundsToCarrier);

export default router;