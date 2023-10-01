import express from "express";
import { countryData } from "./countryData.controller";
const router = express.Router();

router.get('/city/info/get',countryData)



export default router;