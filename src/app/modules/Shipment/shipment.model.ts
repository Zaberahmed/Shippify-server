import { Schema, model } from "mongoose";


// {
//     "shipment_id": "se-764840657",
//     "carrier_id": "se-5332842",
//     "service_code": "usps_priority_mail",
//     "external_shipment_id": null,
//     "shipment_number": null,
//     "ship_date": "2023-09-18T00:00:00Z",
//     "created_at": "2023-09-17T11:27:35.197Z",
//     "modified_at": "2023-09-17T11:27:35.18Z",
//     "shipment_status": "pending",
//     "ship_to": {
//         "instructions": null,
//         "name": "Amanda Miller",
//         "phone": null,
//         "email": null,
//         "company_name": null,
//         "address_line1": "525 S Winchester Blvd",
//         "address_line2": null,
//         "address_line3": null,
//         "city_locality": "San Jose",
//         "state_province": "CA",
//         "postal_code": "95128",
//         "country_code": "US",
//         "address_residential_indicator": "unknown"
//     },
//     "ship_from": {
//         "instructions": null,
//         "name": "John Doe",
//         "phone": "512-555-5555",
//         "email": null,
//         "company_name": "Example Corp.",
//         "address_line1": "4009 Marathon Blvd",
//         "address_line2": null,
//         "address_line3": null,
//         "city_locality": "Austin",
//         "state_province": "TX",
//         "postal_code": "78756",
//         "country_code": "US",
//         "address_residential_indicator": "no"
//     },
//     "warehouse_id": null,
//     "return_to": {
//         "instructions": null,
//         "name": "John Doe",
//         "phone": "512-555-5555",
//         "email": null,
//         "company_name": "Example Corp.",
//         "address_line1": "4009 Marathon Blvd",
//         "address_line2": null,
//         "address_line3": null,
//         "city_locality": "Austin",
//         "state_province": "TX",
//         "postal_code": "78756",
//         "country_code": "US",
//         "address_residential_indicator": "no"
//     },
//     "is_return": false,
//     "confirmation": "none",
//     "customs": {
//         "contents": "merchandise",
//         "contents_explanation": null,
//         "customs_items": [],
//         "non_delivery": "return_to_sender",
//         "buyer_shipping_amount_paid": null,
//         "duties_paid": null,
//         "terms_of_trade_code": null,
//         "declaration": null,
//         "invoice_additional_details": {
//             "freight_charge": null,
//             "insurance_charge": null,
//             "other_charge": null,
//             "other_charge_description": null,
//             "discount": null
//         },
//         "importer_of_record": null
//     },
//     "external_order_id": null,
//     "order_source_code": null,
//     "advanced_options": {
//         "bill_to_account": null,
//         "bill_to_country_code": null,
//         "bill_to_party": null,
//         "bill_to_postal_code": null,
//         "contains_alcohol": false,
//         "delivered_duty_paid": false,
//         "non_machinable": false,
//         "saturday_delivery": false,
//         "dry_ice": false,
//         "dry_ice_weight": null,
//         "fedex_freight": null,
//         "third_party_consignee": false,
//         "ancillary_endorsements_option": null,
//         "freight_class": null,
//         "custom_field1": null,
//         "custom_field2": null,
//         "custom_field3": null,
//         "collect_on_delivery": null,
//         "return_pickup_attempts": null,
//         "additional_handling": false,
//         "own_document_upload": false
//     },
//     "insurance_provider": "none",
//     "tags": [],
//     "packages": [
//         {
//             "shipment_package_id": null,
//             "package_id": "se-3",
//             "package_code": "package",
//             "package_name": "Package",
//             "weight": {
//                 "value": 17.00,
//                 "unit": "ounce"
//             },
//             "dimensions": {
//                 "unit": "inch",
//                 "length": 36.00,
//                 "width": 12.00,
//                 "height": 24.00
//             },
//             "insured_value": {
//                 "currency": "usd",
//                 "amount": 0.00
//             },
//             "label_messages": {
//                 "reference1": null,
//                 "reference2": null,
//                 "reference3": null
//             },
//             "external_package_id": null,
//             "content_description": null,
//             "products": []
//         }
//     ],
//     "total_weight": {
//         "value": 17.00,
//         "unit": "ounce"
//     },
//     "items": []
// },

export interface IShipment {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    shipment_detail: object;
    insurance_detail?: object;
    paymentStatus?: object;
    labelDetail?: object;

    // shipment_id?: string;
    // carrier_id?: string;
    // service_code?: string;
    // external_shipment_id?: string;
    // shipment_number?: string;
    // ship_date?: Date;
    // created_at?: Date;
    // modified_at?: Date;
    // shipment_status?: string;
    // ship_to?: object;
    // ship_from?: object;
    // warehouse_id?: string;
    // return_to?: object;
    // is_return?: boolean;
    // confirmation?: string;
    // external_order_id?: string;
    // order_source_code?: string;
    // advanced_options?: object;
    // insurance_provider?: string;
    // tags?: [];
    // total_weight?: object;
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

    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // using for populate
    shipment_detail: { type: Object, required: true, },
    insurance_detail: { type: Object, required: false, default: {} },
    paymentStatus: { type: Object, required: false, default: {} },
    labelDetail: { type: Object, required: false, default: {} },
    // pickUpPoint: { type: Array, default: [], required: false },
    // selectedCarriers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true, // This option will automatically create 'created_at' and 'updated_at' fields
});

const Shipment = model("Shipment", shipmentSchema);

export default Shipment;