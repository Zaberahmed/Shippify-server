import axios from "axios";
import headers from "../utils/headers";

const bnplServerApi = "192.168.68.89:4000";

export const bnplPayment = async (payload: object) => {
  // console.log("=================payload=======================");
  // console.log(payload)
  
  try {
    const { data } = await axios.post(
      `${bnplServerApi}/order/`,
      payload,
      headers
    );

    // console.log("=================data=======================");
    // console.log(data)
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateBNPLPayment = async (payload: object) => {
  try {
    //   {
    //     "order_id" : "65190d450804072f84e6f3b5", // shipmentId
    //     "payment_id": "65190d450804072f84e6f3b7",
    //     "payment_date": "2023-11-23T00:00:00.000Z"
    // }
    const { data } = await axios.post(
      `${bnplServerApi}/order/update-payment-status`,
      payload,
      headers
    );

    return data;
  } catch (error) {
    throw error;
  }
};
