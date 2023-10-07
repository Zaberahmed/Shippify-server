import axios from "axios";
import headers, { switchCaseArray } from "../../utils/headers";
import { NextFunction, Request, Response } from "express";
import {
  createLtlShipmentToDB,
  getAllShipmentFromDB,
  getLTLShipmentDetail,
  getShipmentDetailFromDB,
  shipmentsWithoutReceivedLtl,
  updateLtlShipmentByIdFromDB,
} from "./ltlShipment.service";
import { bnplPayment } from "../../services/service.bnpl";
import {
  calculateInsuranceAPI,
  getInsurance,
} from "../../services/services.insurance";
import { createBOLAPI } from "../../services/service.labelCreator";
import { createShipmentToBlockchain } from "../../services/services.blockchain";
import mongoose from "mongoose";
import LtlShipment from "./ltlShipment.model";

const carrier_id = "01fa61d0-bce9-4c29-b9b8-7bad8be17edc";

export const getAllLtlShipment = async (
  req: Request | any,
  res: Response
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

export const getLTLShipmentDetailById = async (
  req: Request | any,
  res: Response
) => {
  try {
    // const user = req.authUser;
    const shipment = await getShipmentDetailFromDB(req?.params?._id);

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
  res: Response
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
  res: Response
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
    console.log("=====================shipmentDetail=====================");
    console.log(dbData);
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
  res: Response
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
          residential: false,
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
  res: Response
) => {
  try {
    // const user = req.authUser;
    const { _id, quote_id, pickup_date, carrier, estimated_delivery_days } =
      req.body;

    // const deliveryDate = new Date(`${pickup_date}`);
    // deliveryDate.setDate(deliveryDate.getDate() + estimated_delivery_days);

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
    // console.log("=====================shipmentDetail=====================");
    // console.log(shipmentDetail);

    const deliveryDate = new Date(`${req.body.pickup_date}`);
    deliveryDate.setDate(
      deliveryDate.getDate() + req.body.estimated_delivery_days
    );

    const requestData = {
      pickup_date: req.body.pickup_date,
      pickup_window: {
        start_at: "08:00:00-06:00",
        end_at: "17:00:00-06:00",
        closing_at: "17:00:00-06:00",
      },
      delivery_date: deliveryDate.toISOString().slice(0, 10),
      carrier: req.body.carrier,
    };
    // console.log("=====================requestData=====================");
    // console.log(requestData);

    const bolData = await createBOLAPI(req.body?.quote_id, requestData);
    // console.log("===========================bolData======================");
    // console.log(bolData);

    const ship_to = shipmentDetail?.shipment_detail?.shipment?.ship_to;
    const ship_from = shipmentDetail?.shipment_detail?.shipment?.ship_from;
    // console.log("=================ship_to & ship_from=================");
    // console.log(ship_to, ship_from);

    // insurance process
    const insuranceRequestData = {
      insurance: {
        user_id: (shipmentDetail?.user?._id).toString(),
        shipment_id: (shipmentDetail?._id).toString(),
        tracking_code: shipmentDetail?.shipment_detail?.carrier_quote_id,
        carrier: shipmentDetail?.shipment_detail?.carrier_quote_id,
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
    // console.log("=================insuranceRequestData=================");
    // console.log(insuranceRequestData);
    const insuranceData = await getInsurance(insuranceRequestData);
    // console.log("=====================insuranceData=====================");
    // console.log(insuranceData);

    const blockchainCreateShipment = {
      user_id: (shipmentDetail?.user?._id).toString(),
      email: shipmentDetail?.user?.email,
      shipmentServiceCode: shipmentDetail?.shipment_detail?.service?.code,
      carrierName: "Test LTL Carrier",
      createdAt: shipmentDetail?.createdAt,
      status: "bol_purchased",
      selectedRate: shipmentDetail?.shipment_detail?.charges[4]?.amount?.value,
      noOfInstallments: "",
      netPayable: "",
      insuranceAmount: "" + insuranceData?.fee?.amount,
      paymentMethod: "",
      instalmentDeadLine: [] as string[],
      payableAmount: [] as string[],
      paymentDate: [] as string[],
      paidAmount: [] as string[],
    };

    // console.log("===============blockchainCreateShipment===============");
    // console.log(blockchainCreateShipment);

    // payment process
    let paymentData = {
      status: "",
      net_payable: "",
    };

    if (req.body?.bnpl) {
      const paymentDetail = {
        user_id: (shipmentDetail?.user?._id).toString(),
        shipment_id: (shipmentDetail?._id).toString(),
        net_payable: req.body?.bnpl?.net_payable, //"500"
        numberOfInstallments: req.body?.bnpl?.numberOfInstallments, // 4
        payments: [
          {
            payable: req.body?.bnpl?.first_payable, // "125"
            paid: true,
            paymentDeadline: new Date(
              req.body?.bnpl?.currentDate
            ).toISOString(),
            paymentDate: new Date(req.body?.bnpl?.currentDate).toISOString(),
            defaults: 0,
          },
        ],
      };

      const bnplResData = await bnplPayment(paymentDetail);
      // console.log("=============bnplReqData=============");
      // console.log(paymentDetail);
      // console.log("=============bnplResData=============");
      // console.log(bnplResData);

      blockchainCreateShipment.netPayable = req.body?.bnpl?.net_payable;
      blockchainCreateShipment.noOfInstallments =
        "" + bnplResData?.numberOfInstallments;
      blockchainCreateShipment.paymentMethod = "BNPL";
      if (bnplResData?.order?.payments?.length > 0) {
        (bnplResData?.order?.payments).map((item: any, i: any) => {
          blockchainCreateShipment.instalmentDeadLine[i] = new Date(
            item.paymentDeadline
          ).toISOString();
          blockchainCreateShipment.payableAmount[i] = "" + item.payable;
          if (item?.paid) {
            blockchainCreateShipment.paymentDate[i] = new Date(
              item.paymentDate
            ).toISOString();
            blockchainCreateShipment.paidAmount[i] = "" + item.payable;
          }
        });
      }

      paymentData = {
        status: "bnpl",
        net_payable: bnplResData?.order?.net_payable,
      };
    } else {
      paymentData = {
        status: "done",
        ...req.body?.normal_payment,
      };

      blockchainCreateShipment.paymentMethod = "DONE";
      blockchainCreateShipment.netPayable =
        req.body?.normal_payment?.net_payable;
      blockchainCreateShipment.noOfInstallments = "0";
    }
    // console.log("===========================paymentData======================");
    // console.log(paymentData);

    // console.log("===============blockchainCreateShipment===============");
    // console.log(blockchainCreateShipment);

    // return res.status(200).json({
    //   status: "error",
    //   data: shipmentDetail,
    // });

    const blockchainTokens = await createShipmentToBlockchain(
      blockchainCreateShipment
    );

    const payloadForDB = {
      _id: req?.params?._id,
      updateFields: {
        insurance_detail: insuranceData,
        bolDetail: bolData,
        shipment_status: "bol_purchased",
        payment_detail: paymentData,
        blockChainHash: blockchainTokens?.data?.blockChainHash,
        dataAccessHash: blockchainTokens?.data?.dataAccessHash,
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

//filter by shipment_detail.shipment_status
export const filterOutReceivedShipments = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user's identifier from the authenticated user
    const uId = req.authUser; // Assuming req.authUser contains the user's identifier

    const pipeline: any = [
      {
        $match: {
          bolDetail: { $exists: true },
          shipment_status: { $ne: "received" },
          user: new mongoose.Types.ObjectId(uId)
        },
      },
      {
        $sort: {
          updatedAt: -1, // Sort in descending order by updatedAt to get the most recent first
        },
      },
    ];

    const result = await shipmentsWithoutReceivedLtl(pipeline, uId);

    res.status(200).json({
      status: "success",
      result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const getDifferentPackageLtl = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user's identifier from the authenticated user
    const uId = req.authUser; // Assuming req.authUser contains the user's identifier

    const result = await LtlShipment.aggregate([
      {
        $match: {
          createdAt: {
            $exists: true,
            $type: "date",
          },
          bolDetail: { $exists: true },
          user: new mongoose.Types.ObjectId(uId),
        },
      },
      {
        $unwind: "$shipment_detail.shipment.packages", // Unwind the packages array inside shipment_detail
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalPackages: { $sum: 1 }, // Count the packages
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: {
            $switch: {
              branches: switchCaseArray,
              default: "unknown",
            },
          },
          totalPackages: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error,
    });
  }
};
