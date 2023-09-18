import { NextFunction, Request, Response } from "express";
import axios from "axios";
import headers from "../../utils/headers";

export const getAllShip = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { data } = await axios.get("https://api.shipengine.com/v1/carriers", headers)
        return res.status(200).json({
            status: "success",
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error
        })
    }
}


export const addFundsToCarrier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sendData = await req.body;
        console.log(typeof JSON.stringify(sendData));
        const { data } = await axios.post(`https://api.shipengine.com/v1/rates/estimate`, JSON.stringify(sendData), headers)

        return res.status(200).json({
            status: "success",
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error
        })
    }
}


// {
// 	"amount": 200,
// 	"currency": "usd"
// }
// export const addFundsToCarrier = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const sendData = await req.body;
//         console.log(typeof JSON.stringify(sendData));
//         const { data } = await axios.put(`https://api.shipengine.com/v1/carriers/se-5332370/add_funds`, JSON.stringify(sendData), configHeader)

//         return res.status(200).json({
//             status: "success",
//             data: data
//         })
//     } catch (error) {
//         return res.status(500).json({
//             status: "error",
//             error
//         })
//     }
// }



// [
// 	{
// 		"address_line1": "525 S Winchester Blvd",
// 		"city_locality": "San Jose",
// 		"state_province": "CA",
// 		"postal_code": "95128",
// 		"country_code": "US"
// 	}
// ]
// export const addFundsToCarrier = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const sendData = await req.body;
//         console.log(typeof JSON.stringify(sendData));
//         const { data } = await axios.post(`https://api.shipengine.com/v1/addresses/validate`, JSON.stringify(sendData), configHeader)

//         return res.status(200).json({
//             status: "success",
//             data: data
//         })
//     } catch (error) {
//         return res.status(500).json({
//             status: "error",
//             error
//         })
//     }
// }
