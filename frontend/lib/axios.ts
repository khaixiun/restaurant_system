import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get("token");
        if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Token expired or unauthorized session detected. Clearing client credentials...");
            Cookies.remove("token");
            Cookies.remove("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;