import axios from "axios";
import headers from "../utils/headers";

export const bnplPayment = async (payload: object) => {
  try {
    const { data } = await axios.post(
      `http://localhost:4000/order/`,
      payload,
      headers
    );

    return data;
  } catch (error) {
    throw error;
  }
};
