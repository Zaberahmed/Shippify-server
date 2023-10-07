import axios from "axios";
import headers from "../utils/headers";

const bnplServerApi = "http://192.168.0.104:4000";

export const bnplPayment = async (payload: object) => {
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

export const upcomingPayment = async (payload: {user_id: string}) => {
  try {
    const { data } = await axios.post(
      `${bnplServerApi}/order/upcoming-payments/user-id`,
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

