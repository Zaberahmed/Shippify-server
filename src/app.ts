import express, { Application, Request, Response, json, urlencoded } from "express";
import cors from "cors";
import userRouter from "./app/modules/user/user.router";
import carrierRouter from "./app/modules/Carrier/carrier.router";
import shipmentRouter from "./app/modules/Shipment/shipment.router";
import ltlShipmentRouter from "./app/modules/ltlShipment/ltlShipment.router";
import customPackageRouter from "./app/modules/customPackage/customPackage.route";
import warehouseRouter from "./app/modules/warehouse/warehouse.route";
import { scheduleDelete } from "./app/modules/Shipment/shipment.controller";



const app: Application = express();
// using cors
app.use(cors({ credentials: false, origin: true }));

// parse data
app.use(json());
app.use(urlencoded({ extended: true }));

scheduleDelete();

app.get('/', (req: Request, res: Response) => {
    res.send('My server is running !')
})

app.use("/user", userRouter);
app.use("/carrier", carrierRouter);
app.use("/shipment", shipmentRouter);
app.use("/ltlShipment", ltlShipmentRouter);
app.use("/custom-package-type", customPackageRouter);
app.use("/warehouse", warehouseRouter)


export default app;