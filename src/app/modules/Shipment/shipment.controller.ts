import axios from "axios";
import headers, { switchCaseArray } from "../../utils/headers";
import { NextFunction, Request, Response } from "express";
import {
  createShipmentToDB,
  deleteShipmentByIdFromDB,
  failedShipmentGroup,
  getAllShipmentFromDB,
  getShipmentDetail,
  shipmentsGroup2,
  shipmentsGroupByMonth,
  shipmentsGroupByStatus,
  successShipmentGroup,
  updateShipmentByIdFromDB,
  updateShipmentStatusIdFromDB,
} from "./shipment.service";
import Shipment from "./shipment.model";
import {
  calculateInsuranceAPI,
  getInsurance,
} from "../../services/services.insurance";
import cron from "node-cron";
import { createLabel } from "../../services/service.labelCreator";
import { bnplPayment, updateBNPLPayment } from "../../services/service.bnpl";
import {
  createShipmentToBlockchain,
  updateInstalmentToBlockchain,
  updateStatusToBlockchain,
} from "../../services/services.blockchain";

export const getAllShipment = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const uId = req.authUser;
    const shipment = await getAllShipmentFromDB(uId);

    return res.status(200).json({
      status: "success",
      data: shipment,
    });
  } catch (error: any) {
    // console.log(error?.response?.data);
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

export const shipmentDetail = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const shipment = await getShipmentDetail(req.params._id);

    return res.status(200).json({
      status: "success",
      data: shipment,
    });
  } catch (error: any) {
    // console.log(error?.response?.data);
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

// export const createShipment = async (req: Request | any, res: Response, next: NextFunction) => {
//     try {
//         // console.log(req.authUser);
//         const { data } = await axios.post("https://api.shipengine.com/v1/shipments", req.body, headers);
//         if (data) {
//             const finalData = {
//                 // user: req.authUser,
//                 user: "650865e8330ebee9dd82b41e",
//                 shipment_detail: data?.shipments[0]
//             }
//             const shipment = await createShipmentToDB(finalData);
//             // console.log(shipment);
//             return res.status(200).json({
//                 status: "success",
//                 data: shipment
//             })
//         }

//         throw "can not possible to create shipment now";

//     } catch (error: any) {
//         console.log(error?.response?.data);
//         if (error?.response?.data) {
//             return res.status(500).json({
//                 status: "error",
//                 error: error?.response?.data
//             })
//         }
//         return res.status(500).json({
//             status: "error",
//             error
//         })
//     }
// }

export const createShipmentAndGetAllRelevantRates = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.body);
    const createdShipmentData = await axios.post(
      "https://api.shipengine.com/v1/shipments",
      req.body,
      headers
    );

    if (!createdShipmentData?.data)
      throw "can not possible to create shipment now";
    // console.log(req.body?.shipments[0]?.customs);

    const finalData = {
      user: req.authUser,
      shipment_detail: createdShipmentData?.data?.shipments[0],
    };

    const shipment = await createShipmentToDB(finalData);

    if (!shipment?.shipment_detail?.shipment_id)
      throw "can not possible to create shipment at this moment";

    const forRateDetail = {
      rate_options: {
        carrier_ids: ["se-5332842", "se-5332843", "se-5332844"],
        calculate_tax_amount: req.body?.shipments[0]?.customs ? true : false,
      },
      shipment_id: shipment?.shipment_detail?.shipment_id,
    };

    const { data } = await axios.post(
      "https://api.shipengine.com/v1/rates",
      forRateDetail,
      headers
    );

    if (!data.rate_response) throw "No shipment found for this goods now";

    return res.status(200).json({
      status: "success",
      data: shipment,
      rateDetail: data.rate_response,
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

export const updateShipmentById = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const payload = {
      _id: id,
      updateFields: req.body,
    };

    const updatedShipmentData = await updateShipmentByIdFromDB(payload);
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

export const updateShipmentStatusId = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  try {
    const payload = {
      _id: req.params._id,
      status: req.body.status,
    };

    const blockchainStatusUpdate = await updateStatusToBlockchain(
      req.body.dataAccessHash,
      req.body.status
    );

    const updatedShipmentData = await updateShipmentStatusIdFromDB(payload);
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

export const addSelectedRateForShipment = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const uId = req.authUser;
    const { shipmentId, selectedRate } = req.body;

    const payload = {
      _id: shipmentId,
      updateFields: {
        rateDetail: selectedRate,
      },
    };
    // console.log(shipmentId, selectedRate);

    const updatedShipmentData = await updateShipmentByIdFromDB(payload);
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

export const calculateInsurance = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body, req?.params?._id);
    const shipmentDetail = await getShipmentDetail(req?.params?._id);

    const ship_to = shipmentDetail?.shipment_detail?.ship_to;
    const ship_from = shipmentDetail?.shipment_detail?.ship_from;

    const insuranceRequestData = {
      insurance: {
        user_id: (shipmentDetail?.user?._id).toString(),
        shipment_id: shipmentDetail?.shipment_detail?.shipment_id,
        tracking_code: "kgjn5o4ie5lfdkg594444iflirj",
        carrier: shipmentDetail?.rateDetail?.carrier_id,
        reference: "",
        amount: req.body.amount, // from frontend
        to_address: {
          name: ship_to?.name,
          company: ship_to?.company_name,
          street1: ship_to?.address_line1,
          street2: ship_to?.address_line2,
          city: ship_to?.city_locality,
          state: ship_to?.state_province,
          zip: ship_to?.postal_code,
          country: ship_to?.country_code,
          phone: ship_to?.phone,
          email: ship_to?.email,
          carrier_facility: null,
          residential:
            ship_to?.address_residential_indicator == "yes" ? true : false,
          federal_tax_id: null,
          state_tax_id: null,
        },
        from_address: {
          name: ship_from?.name,
          company: ship_from?.company_name,
          street1: ship_from?.address_line1,
          street2: ship_from?.address_line2,
          city: ship_from?.city_locality,
          state: ship_from?.state_province,
          zip: ship_from?.postal_code,
          country: ship_from?.country_code,
          phone: ship_from?.phone,
          email: ship_from?.email,
          carrier_facility: null,
          residential:
            ship_from?.address_residential_indicator == "yes" ? true : false,
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

export const parchedShipment = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("=============req.body=============");
    // console.log(req.body);
    const shipmentDetail = await getShipmentDetail(req?.params?._id);
    // console.log("=============shipmentDetail=============");
    // console.log(shipmentDetail);

    const labelData = await createLabel(
      shipmentDetail?.rateDetail?.rate_id as string
    );
    // console.log("=============labelData=============");
    // console.log(labelData);

    const ship_to = shipmentDetail?.shipment_detail?.ship_to;
    const ship_from = shipmentDetail?.shipment_detail?.ship_from;

    // insurance process
    const insuranceRequestData = {
      insurance: {
        user_id: (shipmentDetail?.user?._id).toString(),
        shipment_id: shipmentDetail?.shipment_detail?.shipment_id,
        tracking_code: labelData?.tracking_number,
        carrier: shipmentDetail?.rateDetail?.carrier_id,
        reference: "",
        amount: req.body.insurance_amount, // from frontend
        to_address: {
          name: ship_to?.name,
          company: ship_to?.company_name,
          street1: ship_to?.address_line1,
          street2: ship_to?.address_line2,
          city: ship_to?.city_locality,
          state: ship_to?.state_province,
          zip: ship_to?.postal_code,
          country: ship_to?.country_code,
          phone: ship_to?.phone,
          email: ship_to?.email,
          carrier_facility: null,
          residential:
            ship_to?.address_residential_indicator == "yes" ? true : false,
          federal_tax_id: null,
          state_tax_id: null,
        },
        from_address: {
          name: ship_from?.name,
          company: ship_from?.company_name,
          street1: ship_from?.address_line1,
          street2: ship_from?.address_line2,
          city: ship_from?.city_locality,
          state: ship_from?.state_province,
          zip: ship_from?.postal_code,
          country: ship_from?.country_code,
          phone: ship_from?.phone,
          email: ship_from?.email,
          carrier_facility: null,
          residential:
            ship_from?.address_residential_indicator == "yes" ? true : false,
          federal_tax_id: null,
          state_tax_id: null,
        },
      },
    };

    const insuranceData = await getInsurance(insuranceRequestData);
    // console.log("==================insuranceData==================");
    // console.log(insuranceData);

    const blockchainCreateShipment = {
      user_id: (shipmentDetail?.user?._id).toString(),
      email: shipmentDetail?.user?.email,
      shipmentServiceCode: shipmentDetail?.rateDetail?.service_code,
      carrierName: shipmentDetail?.rateDetail?.carrier_friendly_name,
      createdAt: labelData?.created_at,
      status: "label_purchased",
      selectedRate: shipmentDetail?.rateDetail?.shipping_amount?.amount,
      noOfInstallments: "",
      netPayable: "",
      insuranceAmount: insuranceData?.fee?.amount,
      paymentMethod: "",
      instalmentDeadLine: [] as string[],
      payableAmount: [] as string[],
      paymentDate: [] as string[],
      paidAmount: [] as string[],
    };

    // payment process
    let paymentData = {
      status: "",
      net_payable: "",
    };
    if (req.body?.bnpl) {
      const paymentDetail = {
        user_id: (shipmentDetail?.user?._id).toString(),
        shipment_id: shipmentDetail?.shipment_detail?.shipment_id,
        net_payable: req.body?.bnpl?.net_payable, //"500"
        numberOfInstallments: req.body?.bnpl?.numberOfInstallments, // 4
        payments: [
          {
            payable: req.body?.bnpl?.first_payable, // "125"
            paid: true,
            paymentDeadline: new Date(req.body?.bnpl?.currentDate).toString(),
            paymentDate: new Date(req.body?.bnpl?.currentDate).toString(),
            defaults: 0,
          },
        ],
      };

      const bnplResData = await bnplPayment(paymentDetail);
      // console.log("=============bnplReqData=============");
      // console.log(paymentDetail);
      // console.log("=============bnplResData=============");
      // console.log(bnplResData?.order?.payments);


      if(!bnplResData){
        throw "bnpl not respomding"
      }

      blockchainCreateShipment.netPayable = req.body?.bnpl?.net_payable;
      blockchainCreateShipment.noOfInstallments =
        "" + bnplResData?.numberOfInstallments;
      blockchainCreateShipment.paymentMethod = "BNPL";
      if (bnplResData?.order?.payments?.length > 0) {
        (bnplResData?.order?.payments).map((item: any, i: any) => {
          blockchainCreateShipment.instalmentDeadLine[i] = new Date(
            item.paymentDeadline
          ).toString();
          blockchainCreateShipment.payableAmount[i] = "" + item.payable;
          if (item?.paid) {
            blockchainCreateShipment.paymentDate[i] = new Date(
              item.paymentDate
            ).toString();
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
      blockchainCreateShipment.paymentMethod = req.body?.normal_payment?.net_payable;
      blockchainCreateShipment.noOfInstallments = "0";
    }

    // console.log(
    //   "===========================payloadForDB======================"
    // );
    // console.log(payloadForDB);

    // console.log("===============blockchainCreateShipment===============");
    // console.log(blockchainCreateShipment);
    const blockchainTokens = await createShipmentToBlockchain(
      blockchainCreateShipment
    );

    const payloadForDB = {
      _id: req?.params?._id,
      updateFields: {
        insurance_detail: insuranceData,
        labelDetail: labelData,
        "shipment_detail.shipment_status": "label_purchased",
        payment_detail: paymentData,
        blockChainHash: blockchainTokens?.data?.blockChainHash,
        dataAccessHash: blockchainTokens?.data?.dataAccessHash,
      },
    };

    const updatedShipmentData = await updateShipmentByIdFromDB(payloadForDB);

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

export const createLabelBasedOnRateId = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rate_id, _id } = req.params;
    if (!rate_id) throw "rate_id not provided";
    const labelData = await createLabel(rate_id);
    const shipmentDetail = await getShipmentDetail(rate_id);

    const ship_to = shipmentDetail?.shipment_detail?.ship_to;
    const ship_from = shipmentDetail?.shipment_detail?.ship_from;

    const insuranceRequestData = {
      user_id: (shipmentDetail?.user?._id).toString(),
      shipment_id: shipmentDetail?.shipment_detail?.shipment_id,
      tracking_code: labelData?.tracking_number,
      carrier: shipmentDetail?.rateDetail?.carrier_id,
      reference: "",
      amount: req.body.amount, // from frontend
      to_address: {
        name: ship_to?.name,
        company: ship_to?.company_name,
        street1: ship_to?.address_line1,
        street2: ship_to?.address_line2,
        city: ship_to?.city_locality,
        state: ship_to?.state_province,
        zip: ship_to?.postal_code,
        country: ship_to?.country_code,
        phone: ship_to?.phone,
        email: ship_to?.email,
        carrier_facility: null,
        residential:
          ship_to?.address_residential_indicator == "yes" ? true : false,
        federal_tax_id: null,
        state_tax_id: null,
      },
      from_address: {
        name: ship_from?.name,
        company: ship_from?.company_name,
        street1: ship_from?.address_line1,
        street2: ship_from?.address_line2,
        city: ship_from?.city_locality,
        state: ship_from?.state_province,
        zip: ship_from?.postal_code,
        country: ship_from?.country_code,
        phone: ship_from?.phone,
        email: ship_from?.email,
        carrier_facility: null,
        residential:
          ship_from?.address_residential_indicator == "yes" ? true : false,
        federal_tax_id: null,
        state_tax_id: null,
      },
    };

    const finalData = await getInsurance(insuranceRequestData);

    const payloadForInsurance = {
      _id: _id,
      updateFields: {
        insurance_detail: finalData,
        labelDetail: labelData,
        "shipment_detail.shipment_status": "label_purchased",
      },
    };
    const updatedInsuranceShipmentData = await updateShipmentByIdFromDB(
      payloadForInsurance
    );

    return res.status(200).json({
      status: "success",
      data: updatedInsuranceShipmentData,
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

export const getServicePointList = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body["radius"] = 100;
    req.body["max_results"] = 25;
    const { data } = await axios.post(
      `https://api.shipengine.com/v1/service_points/list`,
      req.body,
      headers
    );

    return res.status(200).json({
      status: "success",
      data,
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

export const cancelShipmentById = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shipment_id, _id } = req.params;
    const { data } = await axios.put(
      `https://api.shipengine.com/v1/shipments/${shipment_id}/cancel`,
      headers
    );
    console.log("cancel shipment Response", data);

    const payload = {
      _id: _id,
    };
    const updatedShipmentData = await deleteShipmentByIdFromDB(payload);
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

export const getAllShipmentsGroupByMonth = async (
  req: Request | any,
  res: Response
) => {
  try {
    const uId = req.authUser;
    const result = await shipmentsGroupByMonth(uId);

    // console.log(result);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const groupShipmentByStatus = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const uId = req.authUser;
    const result = await shipmentsGroupByStatus(uId);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const updatePayment = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payable, dataAccessHash, ...restData } = req.body;

    const instalmentResult = await updateInstalmentToBlockchain(
      dataAccessHash,
      {
        paidAmount: payable,
        paidDate: restData?.payment_date,
      }
    );

    console.log(instalmentResult);

    const bnplResult = await updateBNPLPayment(restData);

    res.status(200).json({
      status: "success",
      data: bnplResult,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

//if carrier_id provided it will filter the data through carrier id otherwise show all success shipping result

export const totalSuccessShipmentByMonth = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { carrier_id } = req.body;
    const uId = req.authUser;

    const result = await successShipmentGroup(carrier_id, uId);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

//if carrier_id provided it will filter the data through carrier id otherwise show all failed shipping result
export const totalFailedShipmentByMonth = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { carrier_id } = req.body;
    const uId = req.authUser;

    const result = await failedShipmentGroup(carrier_id, uId);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const sortByPriceAndPackage = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user's identifier from the authenticated user
    const uId = req.authUser; // Assuming req.authUser contains the user's identifier
    const { carrier_id, weightSort, priceSort, shipment_status } = req.body; // Get carrier_id, sort direction, and shipment_status from the request body

    const pipeline: any = [
      {
        $match: {
          labelDetail: { $exists: true },
          ...(carrier_id ? { "rateDetail.carrier_id": carrier_id } : {}),
          // Filter by shipment status if provided
          ...(shipment_status
            ? { "shipment_detail.shipment_status": shipment_status }
            : {}),
        },
      },
    ];

    // Construct the $sort stage based on the "sort" parameter
    if (weightSort === "asc") {
      pipeline.push({
        $sort: {
          "shipment_detail.total_weight": 1, // Sort in ascending order by weight
        },
      });
    } else if (weightSort === "desc") {
      pipeline.push({
        $sort: {
          "shipment_detail.total_weight": -1, // Sort in descending order by weight
        },
      });
    } else if (priceSort === "price_asc") {
      pipeline.push({
        $sort: {
          "rateDetail.shipping_amount": 1, // Sort in ascending order by price
        },
      });
    } else if (priceSort === "price_desc") {
      pipeline.push({
        $sort: {
          "rateDetail.shipping_amount": -1, // Sort in descending order by price
        },
      });
    }

    const result = await shipmentsGroup2(pipeline, uId);

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

//filter by shipment_detail.shipment_status

//Deleting unused data who doesn't have rateDetail property
const deleteUnUsed = async () => {
  try {
    // Find documents in the Shipment collection where rateDetail does not exist
    const data = await Shipment.find({ labelDetail: { $exists: false } });

    if (data.length <= 0) {
      console.log("No documents found, without rateDetail.");
      return;
    }
    // Delete documents without rateDetail property
    const deleteResult = await Shipment.deleteMany({
      labelDetail: { $exists: false },
    });

    if (deleteResult.deletedCount <= 0) {
      console.log("No documents without rateDetail found to delete.");
      return;
    }

    console.log(
      `Deleted ${deleteResult.deletedCount} documents without rateDetail.`
    );
    return;
  } catch (error) {
    console.error("Error while deleting documents without rateDetail:", error);
  }
};

export const scheduleDelete = async () => {
  // Schedule the task based on the determined cron schedule
  cron.schedule("30 16 * * *", () => {
    deleteUnUsed();
  });
};
