import axios from "axios";
import headers from "../utils/headers";

export const createLabel = async (rate_id: string) => {
  try {
    const labelSize = {
      label_format: "pdf",
      label_layout: "4x6",
    };

    if (!rate_id) throw "rate_id not provided";
    const { data } = await axios.post(
      `https://api.shipengine.com/v1/labels/rates/${rate_id}`,
      labelSize,
      headers
    );

    return data;
  } catch (error) {
    throw error;
  }
};
