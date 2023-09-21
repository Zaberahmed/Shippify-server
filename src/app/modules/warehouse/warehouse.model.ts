import { Schema, model } from "mongoose";

export interface IWarehouse {
    _id: Schema.Types.ObjectId;
    warehouse_name: string;
    user: Schema.Types.ObjectId;
    origin_address: {
        company_name: string;
        name: string;
        phone: string;
        address_line1: string;
        address_line2?: string;
        city_locality: string;
        state_province: string;
        postal_code: string;
        country_code: string;
        address_residential_indicator: string;
    }
}

const warehouseSchema = new Schema<IWarehouse>(
    {
        warehouse_name: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        origin_address: {
            company_name: { type: String, required: true },
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address_line1: { type: String, required: true },
            address_line2: { type: String },
            city_locality: { type: String, required: true },
            state_province: { type: String, required: true },
            postal_code: { type: String, required: true },
            country_code: { type: String, required: true },
            address_residential_indicator: { type: String, enum: ['yes', 'no'], default: 'no' },
        }
    }, {
    timestamps: true, // This option will automatically create 'created_at' and 'updated_at' fields
});

const Warehouse = model("Warehouse", warehouseSchema);

export default Warehouse;