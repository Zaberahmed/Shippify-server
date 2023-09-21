import LtlShipment, { ILtlShipment } from "./ltlShipment.model";

export const createLtlShipmentToDB = async (shipmentData: any): Promise<ILtlShipment> => {
    try {
        const shipment = new LtlShipment(shipmentData);
        return await shipment.save();
    } catch (err) {
        throw err;
    }
}

export const updateLtlShipmentByIdFromDB = async (payload: any): Promise<ILtlShipment> => {
    try {
        // console.log(payload.updateFields);
        const shipment = await LtlShipment.findByIdAndUpdate({ _id: payload?._id }, { $set: payload.updateFields }, { new: true });
        // console.log("update from database", shipment);
        return shipment as ILtlShipment;
    } catch (err) {
        throw err;
    }
}

export const getAllShipmentFromDB = async (userId: object): Promise<any> => {
    try {
        const result = await LtlShipment.find({ user: userId })
            // .populate('user') // Populate the 'user_id' field with data from the "User" collection
            .exec();

        return result;
    } catch (err) {
        throw err;
    }
}
