import axios from "axios";
import headers from "../utils/headers";

export const getInsurance = async (payload: any) => {
    const { data } = await axios.post(
        `url`,
        payload,
        headers
    );

    return data;
}