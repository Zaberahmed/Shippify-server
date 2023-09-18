import { Schema, model } from "mongoose";

export interface IUser {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    contact?: string;
    password: string;
    companyName?: string;
    companyEmail?: string;
    companyContact?: string;
    website?: string;
    monthlyShipmentValue?: string;
    companyLogo?: string;
    address?: object;
    selectedCarriers?: [object];
    shipments?: [Schema.Types.ObjectId];
};

// creating schema using interface
const userSchema = new Schema<IUser>({
    // user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // using for populate
    // status: { type: String, default: "active", enum: ["active", "done"], required: true }, // set default data
    // name: {
    //     firstName: { type: String, required: true, unique: false },
    //     middleName: { type: String, required: false, unique: false },
    //     lastName: { type: String, required: true, unique: false },
    // },

    name: { type: String, required: true, immutable: true, },
    email: { type: String, required: true, unique: true, immutable: true, },
    password: { type: String, required: true },
    contact: { type: String, required: false },
    companyName: { type: String, required: false },
    companyEmail: { type: String, required: false },
    companyContact: { type: String, required: false },
    website: { type: String, required: false },
    monthlyShipmentValue: { type: String, required: false },
    companyLogo: { type: String, required: false },
    address: { type: Object, default: {}, required: false },
    selectedCarriers: [{ type: Array, default: [] }],
    shipments: [{ type: Schema.Types.ObjectId, ref: 'Shipment' }],
}, {
    timestamps: true, // This option will automatically create 'created_at' and 'updated_at' fields
});

const User = model("User", userSchema);

export default User;