import { Router } from "express";
import { createWarehouse, getAllWarehouse, removeWarehouse } from "./warehouse.controller";
import { authentication } from "../../middlewares/authentication.middleware";

const router = Router();

router.post("/create", authentication, createWarehouse);
router.get("/all-list", authentication, getAllWarehouse);
router.get("/remove/:id", authentication, removeWarehouse);


export default router