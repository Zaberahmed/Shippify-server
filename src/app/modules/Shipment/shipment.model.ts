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

interface IShippingRate {
  rate_id?: string;
  rate_type?: string;
  carrier_id?: string;
  shipping_amount?: {
    currency?: string;
    amount?: number;
  };
  insurance_amount?: {
    currency?: string;
    amount?: number;
  };
  confirmation_amount?: {
    currency?: string;
    amount?: number;
  };
  other_amount?: {
    currency?: string;
    amount?: number;
  };
  rate_details?: any[];
  zone?: null | string;
  package_type?: null | string;
  delivery_days?: number;
  guaranteed_service?: boolean;
  estimated_delivery_date?: string;
  carrier_delivery_days?: string;
  ship_date?: string;
  negotiated_rate?: boolean;
  service_type?: string;
  service_code?: string;
  trackable?: boolean;
  carrier_code?: string;
  carrier_nickname?: string;
  carrier_friendly_name?: string;
  validation_status?: string;
  warning_messages?: string[];
  error_messages?: string[];
}

interface IShippingLabel {
  label_id?: string;
  status?: string;
  shipment_id?: string;
  ship_date?: string;
  created_at?: string;
  shipment_cost?: {
    currency?: string;
    amount?: number;
  };
  insurance_cost?: {
    currency?: string;
    amount?: number;
  };
  rate_details?: any[];
  tracking_number?: string;
  is_return_label?: boolean;
  rma_number?: null | string;
  is_international?: boolean;
  batch_id?: string;
  carrier_id?: string;
  service_code?: string;
  package_code?: string;
  voided?: boolean;
  voided_at?: null | string;
  label_format?: string;
  display_scheme?: string;
  label_layout?: string;
  trackable?: boolean;
  label_image_id?: null | string;
  carrier_code?: string;
  tracking_status?: string;
  label_download?: {
    pdf?: string;
    png?: string;
    zpl?: string;
    href?: string;
  };
  form_download?: null | string;
  qr_code_download?: null | string;
  insurance_claim?: null | string;
  packages?: Array<{
    package_id?: number;
    package_code?: string;
    weight?: {
      value?: number;
      unit?: string;
    };
    dimensions?: {
      unit?: string;
      length?: number;
      width?: number;
      height?: number;
    };
    insured_value?: {
      currency?: string;
      amount?: number;
    };
    tracking_number?: string;
    label_download?: {
      pdf?: string;
      png?: string;
      zpl?: string;
    };
    qr_code_download?: null | string;
    label_messages?: {
      reference1?: null | string;
      reference2?: null | string;
      reference3?: null | string;
    };
    external_package_id?: null | string;
    content_description?: null | string;
    sequence?: number;
  }>;
  charge_event?: string;
  alternative_identifiers?: any[]; // You can replace 'any' with a more specific type if needed
}

interface IServicePoint {
  carrier_code?: string;
  service_codes?: string[];
  service_point_id?: string;
  company_name?: string;
  address_line1?: string;
  city_locality?: string;
  state_province?: string;
  postal_code?: string;
  country_code?: string;
  phone?: string;
  lat?: number;
  long?: number;
  distance_in_meters?: number;
  hours_of_operation?: {
    [day: string]: {
      open?: string;
      close?: string;
    }[];
  };
  features?: string[];
  type?: string;
}

interface IShipmentDetail {
  errors?: any[];
  address_validation?: null | any;
  shipment_id?: string;
  carrier_id?: null | string;
  service_code?: null | string;
  external_shipment_id?: null | string;
  shipment_number?: null | string;
  ship_date?: string;
  created_at?: string;
  modified_at?: string;
  shipment_status?:
    | "pending"
    | "label_purchased"
    | "dropped_at_service_point"
    | "in_transit"
    | "reached_at_service_point"
    | "received"
    | "unknown"
    | "returned";
  ship_to?: {
    instructions?: null | string;
    name?: string;
    phone?: string;
    email?: null | string;
    company_name?: null | string;
    address_line1?: string;
    address_line2?: null | string;
    address_line3?: null | string;
    city_locality?: string;
    state_province?: string;
    postal_code?: string;
    country_code?: string;
    address_residential_indicator?: string;
  };
  ship_from?: {
    instructions?: null | string;
    name?: string;
    phone?: string;
    email?: null | string;
    company_name?: string;
    address_line1?: string;
    address_line2?: null | string;
    address_line3?: null | string;
    city_locality?: string;
    state_province?: string;
    postal_code?: string;
    country_code?: string;
    address_residential_indicator?: string;
  };
  warehouse_id?: null | string;
  return_to?: {
    instructions?: null | string;
    name?: string;
    phone?: string;
    email?: null | string;
    company_name?: string;
    address_line1?: string;
    address_line2?: null | string;
    address_line3?: null | string;
    city_locality?: string;
    state_province?: string;
    postal_code?: string;
    country_code?: string;
    address_residential_indicator?: string;
  };
  is_return?: boolean;
  confirmation?: string;
  customs?: {
    contents?: string;
    contents_explanation?: null | string;
    customs_items?: Array<{
      customs_item_id?: string;
      description?: string;
      quantity?: number;
      value?: number;
      value_currency?: string;
      harmonized_tariff_code?: string;
      country_of_origin?: string;
      unit_of_measure?: null | string;
      weight?: null | any; // You can replace 'any' with a more specific type if needed
    }>;
    non_delivery?: string;
    buyer_shipping_amount_paid?: null | any; // You can replace 'any' with a more specific type if needed
    duties_paid?: null | any; // You can replace 'any' with a more specific type if needed
    terms_of_trade_code?: null | string;
    declaration?: null | string;
    invoice_additional_details?: {
      freight_charge?: null | any; // You can replace 'any' with a more specific type if needed
      insurance_charge?: null | any; // You can replace 'any' with a more specific type if needed
      other_charge?: null | any; // You can replace 'any' with a more specific type if needed
      other_charge_description?: null | string;
      discount?: null | any; // You can replace 'any' with a more specific type if needed
    };
    importer_of_record?: {
      name?: null | string;
      company_name?: null | string;
      address_line1?: null | string;
      address_line2?: null | string;
      city_locality?: null | string;
      state_province?: null | string;
      postal_code?: null | string;
      country_code?: null | string;
      phone?: null | string;
      email?: null | string;
    };
  };
  external_order_id?: null | string;
  order_source_code?: null | string;
  advanced_options?: {
    bill_to_account?: null | string;
    bill_to_country_code?: null | string;
    bill_to_party?: null | string;
    bill_to_postal_code?: null | string;
    contains_alcohol?: boolean;
    delivered_duty_paid?: boolean;
    non_machinable?: boolean;
    saturday_delivery?: boolean;
    dry_ice?: boolean;
    dry_ice_weight?: null | any; // You can replace 'any' with a more specific type if needed
    fedex_freight?: null | string;
    third_party_consignee?: boolean;
    ancillary_endorsements_option?: null | string;
    freight_class?: null | string;
    custom_field1?: null | string;
    custom_field2?: null | string;
    custom_field3?: null | string;
    collect_on_delivery?: null | string;
    return_pickup_attempts?: null | string;
    additional_handling?: boolean;
    own_document_upload?: boolean;
  };
  insurance_provider?: string;
  tags?: any[]; // You can replace 'any' with a more specific type if needed
  packages?: Array<{
    shipment_package_id?: string;
    package_id?: string;
    package_code?: string;
    package_name?: string;
    weight?: {
      value?: number;
      unit?: string;
    };
    dimensions?: {
      unit?: string;
      length?: number;
      width?: number;
      height?: number;
    };
    insured_value?: {
      currency?: string;
      amount?: number;
    };
    label_messages?: {
      reference1?: null | string;
      reference2?: null | string;
      reference3?: null | string;
    };
    external_package_id?: null | string;
    content_description?: null | string;
    products?: any[]; // You can replace 'any' with a more specific type if needed
  }>;
  total_weight?: {
    value?: number;
    unit?: string;
  };
  items?: any[]; // You can replace 'any' with a more specific type if needed
}

export interface IShipment {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  shipment_detail: IShipmentDetail;
  insurance_detail?: object;
  payment_detail?: object;
  rateDetail?: IShippingRate;
  labelDetail?: IShippingLabel;
  pickUpServicePoint?: IServicePoint;
  dropOffServicePoint?: IServicePoint;
  blockChainHash?: string;
  dataAccessHash?: string;
}

// creating schema using interface
const shipmentSchema = new Schema<IShipment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // using for populate
    shipment_detail: { type: Object, required: true },
    insurance_detail: { type: Object, required: false, default: {} },
    payment_detail: { type: Object, required: false, default: {} },
    rateDetail: { type: Object, required: false, default: {} },
    labelDetail: { type: Object, required: false, default: {} },
    pickUpServicePoint: { type: Object, required: false },
    dropOffServicePoint: { type: Object, required: false },
    blockChainHash: { type: String, required: false },
    dataAccessHash: { type: String, required: false },
  },
  {
    timestamps: true, // This option will automatically create 'created_at' and 'updated_at' fields
  }
);

const Shipment = model("Shipment", shipmentSchema);

export default Shipment;
