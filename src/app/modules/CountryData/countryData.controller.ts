import { RequestHandler } from "express";
import { fakeData } from "../../utils/fakeData";


export const countryData: RequestHandler = async (req, res) => {
 try{   
    const result= fakeData()
    res.status(200).json({
        success:true,
        message: "Data fetched successfully",
        result
    })
 }catch(error){
    res.status(500).json({
        message: "Something went wrong",
        error
    })
 }
};
