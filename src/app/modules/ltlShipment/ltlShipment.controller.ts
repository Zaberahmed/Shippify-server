import axios from "axios";
import headers from "../../utils/headers";
import { NextFunction, Request, Response } from "express";
import { createLtlShipmentToDB, getAllShipmentFromDB } from "./ltlShipment.service";

const carrier_id = '01fa61d0-bce9-4c29-b9b8-7bad8be17edc'

export const getAllLtlShipment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        // console.log(req.authUser);
        const shipment = await getAllShipmentFromDB();

        return res.status(200).json({
            status: "success",
            data: shipment
        })
    } catch (error: any) {
        console.log(error?.response?.data);
        if (error?.response?.data) {
            return res.status(500).json({
                status: "error",
                error: error?.response?.data
            })
        }
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const getLtlCarrierDetail = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { data } = await axios.get(`https://api.shipengine.com/v-beta/ltl/carriers/${carrier_id}`, headers);

        return res.status(200).json({
            status: "success",
            data: data
        });
    } catch (error: any) {
        if (error?.response?.data) {
            return res.status(500).json({
                status: "error",
                error: error?.response?.data
            })
        }
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const createQuote = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const user = "650865e8330ebee9dd82b41e";
        const requestData = req.body;
        const { data } = await axios.post(`https://api.shipengine.com/v-beta/ltl/quotes/${carrier_id}`, requestData, headers);

        const dbData = {
            userId: user,
            shipmentDetail: data
        }
        const createShipment = await createLtlShipmentToDB(dbData);

        return res.status(200).json({
            status: "success",
            data: createShipment
        });
    } catch (error: any) {
        if (error?.response?.data) {
            return res.status(500).json({
                status: "error",
                error: error?.response?.data
            })
        }
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const createBOL = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        // const quote_id = req.body.quote_id;
        const quote_id = `197288ca-098f-4576-a152-5d323021d7ba`;
        let deliveryDate = new Date(`${req.body.pickup_date}`);
        deliveryDate.setDate(deliveryDate.getDate() + req.body.estimated_delivery_days);

        const requestData = {
            pickup_date: req.body.pickup_date,
            pickup_window: {
                start_at: "08:00:00-06:00",
                end_at: "17:00:00-06:00",
                closing_at: "17:00:00-06:00"
            },
            delivery_date: `${deliveryDate.getFullYear()}-${deliveryDate.getMonth() + 1}-${deliveryDate.getDate()}`,
            carrier: req.body.carrier
        }
        console.log(deliveryDate, requestData);

        const { data } = await axios.post(`https://api.shipengine.com/v-beta/ltl/quotes/${quote_id}/pickup`, requestData, headers);

        console.log(data);


        return res.status(200).json({
            status: "success",
            data: data
        });
    } catch (error: any) {
        if (error?.response?.data) {
            return res.status(500).json({
                status: "error",
                error: error?.response?.data
            })
        }
        return res.status(500).json({
            status: "error",
            error
        })
    }
}