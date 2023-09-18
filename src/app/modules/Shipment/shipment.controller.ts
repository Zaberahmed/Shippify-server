import axios from "axios";
import headers from "../../utils/headers";
import { NextFunction, Request, Response } from "express";

export const createDomesticShipment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { data } = await axios.post("https://api.shipengine.com/v1/shipments", req.body, headers);

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
        console.log("working");
        const { data } = await axios.post("https://api.shipengine.com/v1/rates", req.body, headers);

        if (data) {
            return res.status(200).json({
                status: "success",
                data
            })
        }

        throw "can not possible to create shipment now";

    } catch (error) {
        console.log(error);
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

        console.log(id);
        const { data } = await axios.post(`https://api.shipengine.com/v1/labels/rates/${id}`, req.body, headers);

        if (data) {
            return res.status(200).json({
                status: "success",
                data
            })
        }

        throw "can not possible to create shipment now";

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const getServicePointList = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        req.body["radius"] = 100;
        req.body["max_results"] = 25;
        const { data } = await axios.post(`https://api.shipengine.com/v1/service_points/list`, req.body, headers);

        if (data) {
            return res.status(200).json({
                status: "success",
                data
            })
        }

        throw "can not possible to create shipment now";

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error
        })
    }
}