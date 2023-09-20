import LtlShipment from "./ltlShipment.model";

export const getAllShipmentFromDB = async (): Promise<any> => {
    try {
        const result = await LtlShipment.find()
            .populate('user') // Populate the 'user_id' field with data from the "User" collection
            .exec();

        return result;
    } catch (err) {
        throw err;
    }
}
