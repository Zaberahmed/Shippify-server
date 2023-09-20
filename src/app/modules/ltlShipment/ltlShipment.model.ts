import { Schema, model } from "mongoose";

export interface ILtlShipment {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    // shipment_detail: IShipmentDetail;
    // insurance_detail?: object;
    // paymentStatus?: object;
    // rateDetail?: IShippingRate;
};


const ltlShipmentSchema = new Schema<ILtlShipment>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // using for populate
    // shipment_detail: { type: Object, required: true, },
    // insurance_detail: { type: Object, required: false, default: {} },
    // paymentStatus: { type: Object, required: false, default: {} },
    // rateDetail: { type: Object, required: false, default: {} },
}, {
    timestamps: true, // This option will automatically create 'created_at' and 'updated_at' fields
});

const LtlShipment = model("ltlShipmentSchema", ltlShipmentSchema);

export default LtlShipment;