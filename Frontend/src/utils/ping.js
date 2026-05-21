import axios from "axios";
import { getBaseURL } from "../api/axiosInstance";

//Temporary getting base url without /api/v1
const baseURL = getBaseURL().replace('/api/v1', '');

export const ping = () => {
    setInterval(() => {
        axios.get(baseURL + '/ping')
            .then(res => {
              // console.log("pinged successfully");
            })
            .catch(err => {
              // console.log("ping failed");
            })
    }, 180000);
}   
