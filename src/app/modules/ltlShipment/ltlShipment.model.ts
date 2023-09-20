import { Schema, model } from "mongoose";

export interface ILtlShipment {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    shipment_detail: object;
    insurance_detail?: object;
    paymentStatus?: object;
    bolDetail?: object;
};

const ltlShipmentSchema = new Schema<ILtlShipment>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // using for populate
    shipment_detail: { type: Object, required: true, },
    insurance_detail: { type: Object, required: false, default: {} },
    paymentStatus: { type: Object, required: false, default: {} },
    bolDetail: { type: Object, required: false, default: {} },
}, {
    timestamps: true, // This option will automatically create 'created_at' and 'updated_at' fields
});

const LtlShipment = model("ltlShipmentSchema", ltlShipmentSchema);

export default LtlShipment;