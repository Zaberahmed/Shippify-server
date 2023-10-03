import axios from "axios";
import headers from "../../utils/headers";
import { NextFunction, Request, Response } from "express";
import {
  createLtlShipmentToDB,
  getAllShipmentFromDB,
  getLTLShipmentDetail,
  getShipmentDetailFromDB,
  updateLtlShipmentByIdFromDB,
} from "./ltlShipment.service";
import { bnplPayment } from "../../services/service.bnpl";
import { updateShipmentByIdFromDB } from "../Shipment/shipment.service";
import { calculateInsuranceAPI, getInsurance } from "../../services/services.insurance";

const carrier_id = "01fa61d0-bce9-4c29-b9b8-7bad8be17edc";

export const getAllLtlShipment = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.authUser;
    const shipment = await getAllShipmentFromDB(user);

    return res.status(200).json({
      status: "success",
      data: shipment,
    });
  } catch (error: any) {
    console.log(error?.response?.data);
    if (error?.response?.data) {
      return res.status(500).json({
        status: "error",
        error: error?.response?.data,
      });
    }
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const getLtlCarrierDetail = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = req.authUser;
    const { data } = await axios.get(
      `https://api.shipengine.com/v-beta/ltl/carriers/${carrier_id}`,
      headers
    );

    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error: any) {
    if (error?.response?.data) {
      return res.status(500).json({
        status: "error",
        error: error?.response?.data,
      });
    }
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const createQuote = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.authUser;
    const requestData = req.body;
    const { data } = await axios.post(
      `https://api.shipengine.com/v-beta/ltl/quotes/${carrier_id}`,
      requestData,
      headers
    );

    const dbData = {
      user: user,
      shipment_detail: data,
    };
    const createShipment = await createLtlShipmentToDB(dbData);

    return res.status(200).json({
      status: "success",
      data: createShipment,
    });
  } catch (error: any) {
    if (error?.response?.data) {
      return res.status(500).json({
        status: "error",
        error: error?.response?.data,
      });
    }
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const calculateLTLInsurance = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body, req?.params?._id);
    const shipmentDetail = await getLTLShipmentDetail(req?.params?._id);

    const ship_to = shipmentDetail?.shipment_detail?.shipment?.ship_to;
    const ship_from = shipmentDetail?.shipment_detail?.shipment?.ship_from;

    const insuranceRequestData = {
      insurance: {
        user_id: shipmentDetail?.user,
        shipment_id: shipmentDetail?.shipment_detail?.quote_id,
        tracking_code: "kgjn5o4ie5lfdkg594444iflirj",
        carrier: "ABC",
        reference: "",
        amount: req.body.amount, // from frontend
        to_address: {
          name: ship_to?.contact?.name,
          company: ship_to?.address?.company_name,
          street1: ship_to?.address?.address_line1,
          street2: ship_to?.address?.address_line2,
          city: ship_to?.address?.city_locality,
          state: ship_to?.address?.state_province,
          zip: ship_to?.address?.postal_code,
          country: ship_to?.address?.country_code,
          phone: ship_to?.contact?.phone_number,
          email: ship_to?.contact?.email,
          carrier_facility: null,
          residential: false,
          federal_tax_id: null,
          state_tax_id: null,
        },
        from_address: {
          name: ship_from?.contact?.name,
          company: ship_from?.address?.company_name,
          street1: ship_from?.address?.address_line1,
          street2: ship_from?.address?.address_line2,
          city: ship_from?.address?.city_locality,
          state: ship_from?.address?.state_province,
          zip: ship_from?.address?.postal_code,
          country: ship_from?.address?.country_code,
          phone: ship_from?.contact?.phone_number,
          email: ship_from?.contact?.email,
          carrier_facility: null,
          residential:false,
          federal_tax_id: null,
          state_tax_id: null,
        },
      },
    };

    const insuranceData = await calculateInsuranceAPI(insuranceRequestData);

    return res.status(200).json({
      status: "success",
      data: insuranceData,
    });
  } catch (error) {
    // if (error?.response?.data) {
    //   return res.status(500).json({
    //     status: "error",
    //     error: error?.response?.data,
    //   });
    // }
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const createBOL = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = req.authUser;
    const { _id, quote_id, pickup_date, carrier, estimated_delivery_days } =
      req.body;

    const deliveryDate = new Date(`${pickup_date}`);
    deliveryDate.setDate(deliveryDate.getDate() + estimated_delivery_days);

    const requestData = {
      pickup_date: pickup_date,
      pickup_window: {
        start_at: "08:00:00-06:00",
        end_at: "17:00:00-06:00",
        closing_at: "17:00:00-06:00",
      },
      delivery_date: "2024-10-31",
      carrier: carrier,
    };
    // console.log(deliveryDate, requestData);

    const { data } = await axios.post(
      `https://api.shipengine.com/v-beta/ltl/quotes/${quote_id}/pickup`,
      requestData,
      headers
    );
    const dbData = {
      _id: _id, // my db _id for shipment
      updateFields: {
        bolDetail: data,
      },
    };

    const createShipment = await updateLtlShipmentByIdFromDB(dbData);
    return res.status(200).json({
      status: "success",
      data: createShipment,
    });
  } catch (error: any) {
    if (error?.response?.data) {
      return res.status(500).json({
        status: "error",
        error: error?.response?.data,
      });
    }
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const parchedLTLShipment = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const shipmentDetail = await getShipmentDetailFromDB(req?.params?._id);
    // console.log(
    //   "===========================shipmentDetail======================"
    // );
    // console.log(shipmentDetail);

    const { quote_id, pickup_date, carrier, estimated_delivery_days } =
      req.body;

    const deliveryDate = new Date(`${pickup_date}`);
    deliveryDate.setDate(deliveryDate.getDate() + estimated_delivery_days);

    const requestData = {
      pickup_date: pickup_date,
      pickup_window: {
        start_at: "08:00:00-06:00",
        end_at: "17:00:00-06:00",
        closing_at: "17:00:00-06:00",
      },
      delivery_date: `${deliveryDate.getFullYear()}-${
        deliveryDate.getMonth() + 1
      }-${deliveryDate.getDate()}`,
      carrier: carrier,
    };
    // console.log(deliveryDate, requestData);

    const { data } = await axios.post(
      `https://api.shipengine.com/v-beta/ltl/quotes/${quote_id}/pickup`,
      requestData,
      headers
    );
    // console.log("===========================bolData======================");
    // console.log(data);

    const ship_to = shipmentDetail[0]?.shipment_detail?.shipment?.ship_to;
    const ship_from = shipmentDetail[0]?.shipment_detail?.shipment?.ship_from;

    // insurance process
    const insuranceRequestData = {
      insurance: {
        user_id: (shipmentDetail[0]?.user).toString(),
        shipment_id: shipmentDetail[0]?.shipment_detail?.quote_id,
        tracking_code: shipmentDetail[0]?.shipment_detail?.carrier_quote_id,
        carrier: shipmentDetail[0]?.shipment_detail?.carrier_quote_id,
        reference: "",
        amount: req.body.insurance_amount, // from frontend
        to_address: {
          name: ship_to?.contact?.name,
          company: ship_to?.address?.company_name,
          street1: ship_to?.address?.address_line1,
          street2: ship_to?.address?.address_line2,
          city: ship_to?.address?.city_locality,
          state: ship_to?.address?.state_province,
          zip: ship_to?.address?.postal_code,
          country: ship_to?.address?.country_code,
          phone: ship_to?.contact?.phone_number,
          email: ship_to?.contact?.email,
          carrier_facility: null,
          residential: false,
          federal_tax_id: null,
          state_tax_id: null,
        },
        from_address: {
          name: ship_from?.contact?.name,
          company: ship_from?.address?.company_name,
          street1: ship_from?.address?.address_line1,
          street2: ship_from?.address?.address_line2,
          city: ship_from?.address?.city_locality,
          state: ship_from?.address?.state_province,
          zip: ship_from?.address?.postal_code,
          country: ship_from?.address?.country_code,
          phone: ship_from?.contact?.phone_number,
          email: ship_from?.contact?.email,
          carrier_facility: null,
          residential: false,
          federal_tax_id: null,
          state_tax_id: null,
        },
      },
    };

    // console.log(
    //   "===========================insuranceRequestData======================"
    // );
    // console.log(insuranceRequestData);

    const insuranceData = await getInsurance(insuranceRequestData);
    // console.log(
    //   "===========================insuranceData======================"
    // );
    // console.log(insuranceData);

    // payment process
    let paymentData = {};
    if (req.body?.bnpl) {
      const paymentDetail = {
        user_id: (shipmentDetail[0]?.user).toString(),
        shipment_id: shipmentDetail[0]?.shipment_detail?.quote_id,
        net_payable: req.body?.bnpl?.net_payable, //"500"
        numberOfInstallments: req.body?.bnpl?.num_of_installment, // 4
        payments: [
          {
            payable: req.body?.bnpl?.first_payable, // "125"
            paid: true,
            paymentDeadline: req.body?.bnpl?.currentDate,
            paymentDate: req.body?.bnpl?.currentDate,
            defaults: 0,
          },
        ],
      };
      const bnplResData = await bnplPayment(paymentDetail);
      paymentData = {
        status: "bnpl",
        net_payable: bnplResData?.net_payable,
      };
    } else {
      paymentData = {
        status: "done",
        ...req.body?.normal_payment,
      };
    }

    // console.log("===========================paymentData======================");
    // console.log(paymentData);

    const payloadForDB = {
      _id: req?.params?._id,
      updateFields: {
        insurance_detail: insuranceData,
        bolDetail: data,
        shipment_status: "bol_purchased",
        payment_detail: paymentData,
      },
    };

    const updatedShipmentData = await updateLtlShipmentByIdFromDB(payloadForDB);

    return res.status(200).json({
      status: "success",
      data: updatedShipmentData,
    });
  } catch (error: any) {
    if (error?.response?.data) {
      return res.status(500).json({
        status: "error",
        error: error?.response?.data,
      });
    }
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};
