import Shipment, { IShipment } from "./shipment.model";

export const createShipmentToDB = async (shipmentData: any): Promise<IShipment> => {
    try {
        const user = new Shipment(shipmentData);
        await user.save();
        return user;
    } catch (err) {
        throw err;
    }
}