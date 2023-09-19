import axios from "axios";
import headers from "../../utils/headers";
import { NextFunction, Request, Response } from "express";

export const getPackageType = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { data } = await axios.get("https://api.shipengine.com/v1/packages", headers);
        return res.status(200).json({
            status: "success",
            data
        })

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

export const createPackageType = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { data } = await axios.post("https://api.shipengine.com/v1/packages", req.body, headers);
        return res.status(200).json({
            status: "success",
            data
        })

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

export const updatePackageType = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { data } = await axios.put(`https://api.shipengine.com/v1/packages/${id}`, req.body, headers);
        return res.status(200).json({
            status: "success",
            data
        })

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

export const deletePackageType = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { data } = await axios.delete(`https://api.shipengine.com/v1/packages/${id}`, headers);
        return res.status(200).json({
            status: "success",
            data
        })

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