import LtlShipment, { ILtlShipment } from "./ltlShipment.model";

export const createLtlShipmentToDB = async (
  shipmentData: any
): Promise<ILtlShipment> => {
  try {
    const shipment = new LtlShipment(shipmentData);
    return await shipment.save();
  } catch (err) {
    throw err;
  }
};

export const updateLtlShipmentByIdFromDB = async (
  payload: any
): Promise<ILtlShipment> => {
  try {
    // console.log(payload.updateFields);
    const shipment = await LtlShipment.findByIdAndUpdate(
      { _id: payload?._id },
      { $set: payload.updateFields },
      { new: true }
    );
    // console.log("update from database", shipment);
    return shipment as ILtlShipment;
  } catch (err) {
    throw err;
  }
};

export const getAllShipmentFromDB = async (userId: object): Promise<any> => {
  try {
    const result = await LtlShipment.find({ user: userId,dataAccessHash:{$exists:true}})
      // .populate('user') // Populate the 'user_id' field with data from the "User" collection
      .exec();

    return result;
  } catch (err) {
    throw err;
  }
};

export const getShipmentDetailFromDB = async (
  payload: object
): Promise<any> => {
  try {
    const result = await LtlShipment.findOne({ _id: payload }).populate("user"); // Populate the 'user_id' field with data from the "User" collection

    return result;
  } catch (err) {
    throw err;
  }
};

export const getLTLShipmentDetail = async (payload: object) => {
  try {
    const result = await LtlShipment.findOne({ _id: payload });
    return result;
  } catch (err) {
    throw err;
  }
};


export const shipmentsWithoutReceivedLtl = async (
  pipeline: any,
  uId?: object
): Promise<any> => {
  //console.log("from service", uId);
  try {
    // Execute the aggregation pipeline
    // const final = await Shipment.find({ user: uId });

    //aggregation pipeline result
    const result = await LtlShipment.aggregate(pipeline);

   

    return result;
  } catch (error) {
    throw error;
  }
};