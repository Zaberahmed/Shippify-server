import { Schema, model } from "mongoose";

export interface IShipment {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    from: object;
    to: object;
    packages: object;
    service: string;
};

// creating schema using interface
const shipmentSchema = new Schema<IShipment>({
    // user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // using for populate
    // status: { type: String, default: "active", enum: ["active", "done"], required: true }, // set default data
    // name: {
    //     firstName: { type: String, required: true, unique: false },
    //     middleName: { type: String, required: false, unique: false },
    //     lastName: { type: String, required: true, unique: false },
    // },

    // name: { type: String, required: true, unique: true, immutable: true, },
    // email: { type: String, required: true, unique: true, immutable: true, },
    // password: { type: String, required: true },
    // contact: { type: String, required: true },
    // companyLogo: { type: String, required: false },
    // pickUpPoint: { type: Array, default: [], required: false },
    // selectedCarriers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true, // This option will automatically create 'created_at' and 'updated_at' fields
});

const Shipment = model("Shipment", shipmentSchema);

export default Shipment;