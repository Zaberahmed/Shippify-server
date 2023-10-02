import axios from "axios";
import headers from "../utils/headers";

export const getInsurance = async (payload: any) => {
  // console.log(payload);
  const { data } = await axios.post(
    `http://192.168.68.76:3000/insurance`,
    payload,
    headers
  );

  return data;
};

export const calculateInsuranceAPI = async (payload: any) => {
  console.log(payload);
  const { data } = await axios.post(
    `http://192.168.68.76:3000/insurance/calculate-premium`,
    payload,
    headers
  );
  console.log(payload);
  return data;
};
