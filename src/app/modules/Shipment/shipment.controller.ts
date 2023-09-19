import axios from "axios";
import headers from "../../utils/headers";
import { NextFunction, Request, Response } from "express";
import { createShipmentToDB } from "./shipment.service";

export const createShipment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        // console.log(req.authUser);
        const { data } = await axios.post("https://api.shipengine.com/v1/shipments", req.body, headers);
        if (data) {
            const finalData = {
                // user: req.authUser,
                user: "650865e8330ebee9dd82b41e",
                shipment_detail: data?.shipments[0]
            }
            const shipment = await createShipmentToDB(finalData);
            // console.log(shipment);
            return res.status(200).json({
                status: "success",
                data: shipment
            })
        }

        throw "can not possible to create shipment now";

    } catch (error: any) {
        console.log(error?.response?.data);
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const updateShipmentById = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { data } = await axios.put(`https://api.shipengine.com/v1/shipments/${id}`, req.body, headers);

        if (data) {
            return res.status(200).json({
                status: "success",
                data
            })
        }

        throw "can not possible to create shipment now";
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const getAllRelevantRates = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const createdShipmentData = await axios.post("https://api.shipengine.com/v1/shipments", req.body, headers);
        let shipment: any;
        if (!createdShipmentData?.data) throw "can not possible to create shipment now";

        const finalData = {
            // user: req.authUser,
            user: "650865e8330ebee9dd82b41e",
            shipment_detail: createdShipmentData?.data?.shipments[0]
        }
        shipment = await createShipmentToDB(finalData);

        if (!shipment?.shipment_detail?.shipment_id) throw "can not possible to create shipment at this moment"

        const forRateDetail = {
            rate_options: {
                carrier_ids: [
                    "se-5332842",
                    "se-5332843",
                    "se-5332844"
                ],
                calculate_tax_amount: true
            },
            shipment_id: shipment?.shipment_detail?.shipment_id
        }

        const { data } = await axios.post("https://api.shipengine.com/v1/rates", forRateDetail, headers);

        if (!data.rate_response) throw "No shipment found for this goods now"

        return res.status(200).json({
            status: "success",
            data: shipment,
            rateDetail: data.rate_response
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const createLabelBasedOnRateId = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) throw "Id not provided";
        const { data } = await axios.post(`https://api.shipengine.com/v1/labels/rates/${id}`, req.body, headers);
        return res.status(200).json({
            status: "success",
            data
        })

    } catch (error) {
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const getServicePointList = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        req.body["radius"] = 100;
        req.body["max_results"] = 25;
        const { data } = await axios.post(`https://api.shipengine.com/v1/service_points/list`, req.body, headers);

        return res.status(200).json({
            status: "success",
            data
        })

    } catch (error) {
        return res.status(500).json({
            status: "error",
            error
        })
    }
}