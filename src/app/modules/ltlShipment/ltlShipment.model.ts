import { Schema, model } from "mongoose";

interface Amount {
  currency: string;
  value: string;
}

interface Address {
  address_line1: string;
  address_line2?: string | null;
  address_line3?: string | null;
  city_locality: string;
  company_name: string | null;
  country_code: string;
  postal_code: string;
  state_province: string;
}

interface Contact {
  email: string;
  name: string;
  phone_number: string;
}

interface Dimensions {
  height: string;
  length: string;
  unit: string;
  width: string;
}

interface Weight {
  unit: string;
  value: string;
}

interface ShipmentOption {
  attributes?: { [key: string]: string | null } | null;
  code: string;
}

interface ShipmentPackage {
  code: string;
  description: string;
  dimensions: Dimensions;
  freight_class: number;
  hazardous_materials: boolean;
  nmfc_code: string;
  quantity: string;
  stackable: boolean;
  weight: Weight;
}

interface ShipmentBillTo {
  account: string;
  address: Address;
  contact: Contact;
  payment_terms: string;
  type: string;
}

interface ShipmentRequestedBy {
  company_name: string | null;
  contact: Contact;
}

interface ShipmentShipFrom {
  account: string | null;
  address: Address;
  contact: Contact;
}

interface ShipmentShipTo {
  account: string;
  address: Address;
  contact: Contact;
}

interface ShipmentService {
  carrier_description: string;
  code: string;
}

interface Shipment {
  bill_to: ShipmentBillTo;
  options: (ShipmentOption | null)[];
  packages: ShipmentPackage[];
  pickup_date: string;
  requested_by: ShipmentRequestedBy;
  service_code: string;
  ship_from: ShipmentShipFrom;
  ship_to: ShipmentShipTo;
}

interface IShipmentDetail {
  carrier_message: string | null;
  carrier_quote_id: string;
  charges: {
    amount: Amount;
    description: string;
    type: string;
  }[];
  effective_date: string | null;
  estimated_delivery_days: number;
  expiration_date: string | null;
  pickup_date: string;
  quote_id: string;
  quote_type: string | null;
  service: ShipmentService;
  shipment: Shipment;
}

interface Document {
  format: string;
  image: string;
  type: string;
}

interface IBolDetail {
  confirmation_number: string;
  documents: Document[];
  message: string | null;
  pickup_id: string;
  pro_number: string;
  quote_id: string;
  shipment_id?: string | null;
  warnings: string[];
}

export interface ILtlShipment {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  shipment_detail: IShipmentDetail;
  insurance_detail?: object;
  payment_detail?: object;
  bolDetail?: IBolDetail;
  shipment_status?: string;
  blockChainHash?: string;
  dataAccessHash?: string;
}

const ltlShipmentSchema = new Schema<ILtlShipment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // using for populate
    shipment_detail: { type: Object, required: true },
    insurance_detail: { type: Object, required: false, default: {} },
    payment_detail: { type: Object, required: false, default: {} },
    bolDetail: { type: Object, required: false, default: {} },
    shipment_status: { type: String, required: false },
    blockChainHash: { type: String, required: false },
    dataAccessHash: { type: String, required: false },
  },
  {
    timestamps: true, // This option will automatically create 'created_at' and 'updated_at' fields
  }
);

const LtlShipment = model("ltlShipmentSchema", ltlShipmentSchema);

export default LtlShipment;
