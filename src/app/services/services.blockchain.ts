import axios from "axios";
import headers from "../utils/headers";

export const getAllShipmentFromBlockchain = async (payload: any) => {
  // console.log(payload);
  const { data } = await axios.get(
    `http://192.168.68.76:8000/all-shipment-blockchain`,
    headers
  );

  return data;
};

export const getShipmentDetailFromBlockchain = async (
  transaction_hash: any
) => {
  console.log(transaction_hash);
  const { data } = await axios.post(
    `http://192.168.68.76:8000/get-detail/${transaction_hash}`,
    headers
  );
  console.log(transaction_hash);
  return data;
};

export const createShipmentToBlockchain = async (payload: any) => {
  // console.log(payload);
  const { data } = await axios.post(
    `http://192.168.68.76:8000/assign-shipment-in-blockchain`,
    payload,
    headers
  );

  return data;
};

export const updateStatusToBlockchain = async (
  transactionHash: string,
  payload: string
) => {
  const reqData = {
    status: payload,
  };
  const { data } = await axios.patch(
    `http://192.168.68.76:8000/update-shipment-status/${transactionHash}`,
    reqData,
    headers
  );

  return data;
};

export const updateInstalmentToBlockchain = async (
  transactionHash: string,
  payload: any
) => {
  // console.log(payload);
  const { data } = await axios.patch(
    `http://192.168.68.76:8000/update-shipment-instalment/${transactionHash}`,
    payload,
    headers
  );

  return data;
};
