import axiosInstance from "../api/axiosInstance";

export const ping = () => {
    setInterval(() => {
        axiosInstance.get('/auth/ping')
            .then(res => console.log("pinged successfully"))
            .catch(err => console.log("ping failed"))
    }, 180000);
}