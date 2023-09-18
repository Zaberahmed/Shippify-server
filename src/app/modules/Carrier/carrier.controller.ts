import axios from "axios";
import { NextFunction, Request, Response } from "express";
import headers from "../../utils/headers";

export const getAllCarriers = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { data } = await axios.get("https://api.shipengine.com/v1/carriers", headers);

        if (data?.carriers) {
            return res.status(200).json({
                status: "success",
                carriers: data.carriers
            })
        }

        throw "can not possible to load data";

    } catch (error) {
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const carrierServices = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { data } = await axios.get(`https://api.shipengine.com/v1/carriers/${id}/services`, headers);

        if (data?.services) {
            return res.status(200).json({
                status: "success",
                services: data.services
            })
        }

        throw "can not possible to load data";
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error
        })
    }
}

export const packagesServices = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { data } = await axios.get(`https://api.shipengine.com/v1/carriers/${id}/packages`, headers);

        if (data?.packages) {
            return res.status(200).json({
                status: "success",
                packages: data.packages
            })
        }

        throw "can not possible to load data";
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error
        })
    }
}