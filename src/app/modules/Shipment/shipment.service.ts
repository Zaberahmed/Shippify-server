import mongoose from "mongoose";
import { switchCaseArray } from "../../utils/headers";
import Shipment, { IShipment } from "./shipment.model";

export const getAllShipmentFromDB = async (payload: object): Promise<any> => {
  try {
    const result = await Shipment.find({ user: payload })
      //   .populate("user") // Populate the 'user_id' field with data from the "User" collection
      .exec();

    return result;
  } catch (err) {
    throw err;
  }
};

export const getShipmentDetail = async (payload: object): Promise<any> => {
  try {
    const result = await Shipment.findOne({ _id: payload }).populate("user");
    return result;
  } catch (err) {
    throw err;
  }
};

export const createShipmentToDB = async (
  shipmentData: any
): Promise<IShipment> => {
  try {
    const shipment = new Shipment(shipmentData);
    return await shipment.save();
  } catch (err) {
    throw err;
  }
};

export const updateShipmentByIdFromDB = async (
  payload: any
): Promise<IShipment> => {
  try {
    // console.log(payload.updateFields);
    // console.log("========================================");
    // console.log("========================================");
    const shipment = await Shipment.findByIdAndUpdate(
      { _id: payload?._id },
      { $set: payload.updateFields },
      { new: true }
    );
    // console.log("update from database", shipment);
    return shipment as IShipment;
  } catch (err) {
    throw err;
  }
};

export const updateShipmentStatusIdFromDB = async (
  payload: any
): Promise<IShipment> => {
  try {
    // console.log(payload.updateFields);
    const shipment = await Shipment.findByIdAndUpdate(
      { _id: payload?._id },
      { $set: { "shipment_detail.shipment_status": payload.status } },
      { new: true }
    );
    console.log("update from database", shipment);
    return shipment as IShipment;
  } catch (err) {
    throw err;
  }
};

export const deleteShipmentByIdFromDB = async (payload: any): Promise<any> => {
  try {
    const shipment = await Shipment.deleteOne({ _id: payload?._id });
    console.log("delete from database", shipment);
    return shipment;
  } catch (err) {
    throw err;
  }
};

export const shipmentsGroupByMonth = async (uId: string): Promise<any> => {
  try {
    const res = await Shipment.aggregate([
      {
        $match: {
          labelDetail: { $exists: true }, // Filter out documents without labelDetail
          user: new mongoose.Types.ObjectId(uId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: {
            $switch: {
              branches: switchCaseArray,
              default: "unknown",
            },
          },
          count: 1,
        },
      },
    ]);

    // console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};

export const shipmentsGroupByStatus = async (uId: string): Promise<any> => {
  try {
    const res = await Shipment.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(uId),
        },
      },
      {
        $group: {
          _id: "$shipment_detail.shipment_status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};

export const successShipmentGroup = async (
  carrier_id: any,
  uId: string
): Promise<any> => {
  try {
    //    const result:any=await Shipment.find({user:uId});
    const res = await Shipment.aggregate([
      {
        $match: {
          labelDetail: { $exists: true },
          "shipment_detail.shipment_status": "received" || "in_transit", // Filter documents with "received" status
          ...(carrier_id ? { "rateDetail.carrier_id": carrier_id } : {}),
          user: new mongoose.Types.ObjectId(uId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: {
            $switch: {
              branches: switchCaseArray,
              default: "unknown",
            },
          },
          count: 1,
        },
      },
    ]);

    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};

export const failedShipmentGroup = async (
  carrier_id: any,
  uId: string
): Promise<any> => {
  try {
    console.log("failed", uId);
    //    const result:any=await Shipment.find({user:uId});
    const res = await Shipment.aggregate([
      {
        $match: {
          labelDetail: { $exists: true },
          "shipment_detail.shipment_status": "unknown" || "returned", // Filter documents with "received" status
          ...(carrier_id ? { "rateDetail.carrier_id": carrier_id } : {}),
          user: new mongoose.Types.ObjectId(uId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: {
            $switch: {
              branches: switchCaseArray,
              default: "unknown",
            },
          },
          count: 1,
        },
      },
    ]);

    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};

export const shipmentsGroup2 = async (
  pipeline: any,
  uId?: object
): Promise<any> => {
  //console.log("from service", uId);
  try {
    // Execute the aggregation pipeline
    // const final = await Shipment.find({ user: uId });

    //aggregation pipeline result
    const result = await Shipment.aggregate(pipeline);

   

    return result;
  } catch (error) {
    throw error;
  }
};
