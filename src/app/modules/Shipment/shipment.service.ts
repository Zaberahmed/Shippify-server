import Shipment, { IShipment } from "./shipment.model";

export const getAllShipmentFromDB = async (): Promise<any> => {
    try {
        // const result = Shipment.find({ "_id": ticketId })
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
        await shipment.save();
        return shipment;
    } catch (err) {
        throw err;
    }
}

export const updateShipmentByIdFromDB = async (payload: any): Promise<IShipment> => {
    try {
        console.log(payload.updateFields);
        const shipment = await Shipment.findByIdAndUpdate({ _id: payload?.shipmentId }, { $set: payload.updateFields }, { new: true });
        console.log(shipment);
        return shipment as IShipment;
    } catch (err) {
        throw err;
    }
}