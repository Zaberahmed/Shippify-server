import axios from "axios";
import headers from "../utils/headers";

export const bnplPayment = async (payload: object) => {
  try {
    const { data } = await axios.post(
      `http://192.168.68.76:4000/order/`,
      payload,
      headers
    );

    return data;
  } catch (error) {
    throw error;
  }
};
