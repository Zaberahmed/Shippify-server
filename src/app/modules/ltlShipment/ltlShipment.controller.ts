import axios from "axios";
import headers from "../../utils/headers";
import { NextFunction, Request, Response } from "express";
import { createLtlShipmentToDB, getAllShipmentFromDB, updateLtlShipmentByIdFromDB } from "./ltlShipment.service";

const carrier_id = '01fa61d0-bce9-4c29-b9b8-7bad8be17edc'

export const getAllLtlShipment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const user = req.authUser;
        // console.log(req.authUser);
        const shipment = await getAllShipmentFromDB(user);

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
        // const user = req.authUser;
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
        const user = req.authUser;
        const requestData = req.body;
        const { data } = await axios.post(`https://api.shipengine.com/v-beta/ltl/quotes/${carrier_id}`, requestData, headers);

        const dbData = {
            user: user,
            shipment_detail: data
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
        // const user = req.authUser;
        const { _id, quote_id, pickup_date, carrier, estimated_delivery_days } = req.body;

        const deliveryDate = new Date(`${pickup_date}`);
        deliveryDate.setDate(deliveryDate.getDate() + estimated_delivery_days);

        const requestData = {
            pickup_date: pickup_date,
            pickup_window: {
                start_at: "08:00:00-06:00",
                end_at: "17:00:00-06:00",
                closing_at: "17:00:00-06:00"
            },
            delivery_date: `${deliveryDate.getFullYear()}-${deliveryDate.getMonth() + 1}-${deliveryDate.getDate()}`,
            carrier: carrier
        }
        // console.log(deliveryDate, requestData);

        const { data } = await axios.post(`https://api.shipengine.com/v-beta/ltl/quotes/${quote_id}/pickup`, requestData, headers);
        const dbData = {
            _id: _id, // my db _id for shipment
            updateFields: {
                bolDetail: data
            }
        }

        const createShipment = await updateLtlShipmentByIdFromDB(dbData);
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