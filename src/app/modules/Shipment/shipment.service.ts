import Shipment, { IShipment } from "./shipment.model";

export const getAllShipmentFromDB = async (): Promise<any> => {
    try {
        const result = await Shipment.find()
            .populate('user') // Populate the 'user_id' field with data from the "User" collection
            .exec();

        return result;
    } catch (err) {
        throw err;
    }
}

export const createShipmentToDB = async (shipmentData: any): Promise<IShipment> => {
    try {
        const shipment = new Shipment(shipmentData);
        return await shipment.save();
    } catch (err) {
        throw err;
    }
}

export const updateShipmentByIdFromDB = async (payload: any): Promise<IShipment> => {
    try {
        // console.log(payload.updateFields);
        const shipment = await Shipment.findByIdAndUpdate({ _id: payload?._id }, { $set: payload.updateFields }, { new: true });
        console.log("update from database", shipment);
        return shipment as IShipment;
    } catch (err) {
        throw err;
    }
}

export const updateShipmentStatusIdFromDB = async (payload: any): Promise<IShipment> => {
    try {
        // console.log(payload.updateFields);
        const shipment = await Shipment.findByIdAndUpdate({ _id: payload?._id }, { $set: { "shipment_detail.shipment_status": payload.status } }, { new: true });
        console.log("update from database", shipment);
        return shipment as IShipment;
    } catch (err) {
        throw err;
    }
}

export const deleteShipmentByIdFromDB = async (payload: any): Promise<any> => {
    try {
        const shipment = await Shipment.deleteOne({ _id: payload?._id });
        console.log("delete from database", shipment);
        return shipment;
    } catch (err) {
        throw err;
    }
}