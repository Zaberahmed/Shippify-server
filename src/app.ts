import express, { Application, Request, Response, json, urlencoded } from "express";
import cors from "cors";
import userRouter from "./app/modules/user/user.router";
import shipEngineRouter from "./app/modules/shipEngine/ship.router";
import carrierRouter from "./app/modules/Carrier/carrier.router";
import shipmentRouter from "./app/modules/Shipment/shipment.router";
import customPackageRouter from "./app/modules/customPackage/customPackage.route";


const app: Application = express();
// using cors
app.use(cors({ credentials: false, origin: true }));

// parse data
app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('My server is running !')
})

app.use("/user", userRouter)
app.use("/ship", shipEngineRouter)
app.use("/carrier", carrierRouter)
app.use("/shipment", shipmentRouter)
app.use("/custom-package-type", customPackageRouter)


export default app;