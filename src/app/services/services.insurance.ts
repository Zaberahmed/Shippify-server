import axios from "axios";
import headers from "../utils/headers";

const insuranceServerApi = "http://192.168.0.104:3000";

export const getInsurance = async (payload: any) => {
  // console.log(payload);
  const { data } = await axios.post(
    `${insuranceServerApi}/insurance`,
    payload,
    headers
  );

  return data;
};

export const calculateInsuranceAPI = async (payload: any) => {
  // console.log(payload);
  const { data } = await axios.post(
    `${insuranceServerApi}/insurance/calculate-premium`,
    payload,
    headers
  );
  console.log(payload);
  return data;
};
