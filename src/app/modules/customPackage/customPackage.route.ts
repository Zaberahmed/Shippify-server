import express from "express";
import { createPackageType, deletePackageType, getPackageType, updatePackageType } from "./customPackage.controllet";
const router = express.Router();


router.get('/list', getPackageType)
router.post('/create', createPackageType)
router.put('/update/:id', updatePackageType)
router.delete('/delete/:id', deletePackageType)

export default router;