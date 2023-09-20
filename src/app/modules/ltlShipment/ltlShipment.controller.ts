import axios from "axios";
import headers from "../../utils/headers";
import { NextFunction, Request, Response } from "express";
import { getAllShipmentFromDB } from "./ltlShipment.service";

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
        const carrier_id = '01fa61d0-bce9-4c29-b9b8-7bad8be17edc'
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
        const requestData = req.body;
        const carrier_id = '01fa61d0-bce9-4c29-b9b8-7bad8be17edc'
        const { data } = await axios.post(`https://api.shipengine.com/v-beta/ltl/quotes/${carrier_id}`, requestData, headers);

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