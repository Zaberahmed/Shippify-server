import axios from "axios";
import headers, { switchCaseArray } from "../../utils/headers";
import { NextFunction, Request, Response } from "express";
import {
  createShipmentToDB,
  deleteShipmentByIdFromDB,
  failedShipmentGroup,
  getAllShipmentFromDB,
  shipmentsGroup2,
  shipmentsGroupByMonth,
  shipmentsGroupByStatus,
  successShipmentGroup,
  updateShipmentByIdFromDB,
  updateShipmentStatusIdFromDB,
} from "./shipment.service";
import Shipment from "./shipment.model";
import { getInsurance } from "../../services/services.insurance";

export const getAllShipment = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const uId = req.authUser;
    console.log(uId);
    const shipment = await getAllShipmentFromDB(uId);

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
      // user: req.authUser,
      user: "650865e8330ebee9dd82b41e",
      shipment_detail: createdShipmentData?.data?.shipments[0],
    };
    let shipment = await createShipmentToDB(finalData);

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
  try {
    const id = req.params._id;
    const payload = {
      _id: id,
      status: req.body.status,
    };

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
    console.log(shipmentId, selectedRate);

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

export const createLabelBasedOnRateId = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {

  const labelSize = {
    "label_format": "pdf",
    "label_layout": "4x6"
  }
  try {
    const { rate_id, _id } = req.params;
    if (!rate_id) throw "rate_id not provided";
    const { data } = await axios.post(
      `https://api.shipengine.com/v1/labels/rates/${rate_id}`,
      labelSize,
      headers
    );
    // console.log(data);

    const payload = {
      _id: _id,
      updateFields: {
        labelDetail: data,
        "shipment_detail.shipment_status": "label_purchased",
      },
    };

    const updatedShipmentData = await updateShipmentByIdFromDB(payload);

    return res.status(200).json({
      status: "success",
      data: updatedShipmentData,
    });

    const ship_to = updatedShipmentData?.shipment_detail?.ship_to;
    const ship_from = updatedShipmentData?.shipment_detail?.ship_from;

    const insuranceRequestData = {
      user_id: updatedShipmentData?.user,
      shipment_id: updatedShipmentData?.shipment_detail?.shipment_id,
      tracking_code: updatedShipmentData?.labelDetail?.tracking_number,
      carrier: updatedShipmentData?.rateDetail?.carrier_id,
      reference: "",
      amount: updatedShipmentData?.labelDetail?.shipment_cost?.amount,
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
        residential: ship_to?.address_residential_indicator == "yes" ? true : false,
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
        residential: ship_from?.address_residential_indicator == "yes" ? true : false,
        federal_tax_id: null,
        state_tax_id: null,
      }
    }

    const finalData = await getInsurance(insuranceRequestData);


    const payloadForInsurance = {
      _id: _id,
      updateFields: {
        insurance_detail: finalData,
      },

    };
    const updatedInsuranceShipmentData = await updateShipmentByIdFromDB(payloadForInsurance);

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
