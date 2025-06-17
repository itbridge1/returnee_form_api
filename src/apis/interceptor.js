import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_ENDPOINT;

export const API_BASE_URL = BASE_URL + "/api/v1/";

export const baseService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

baseService.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            console.error("Base service error", error.response.data);
            return Promise.reject(error.response.data.details || "Error Occured");
        }
        else {
            console.error("Network error", error.message);
            return Promise.reject(error.message);
        }
    }
)

export const authService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json"
    },
});

authService.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        config.headers.Authorization + `Bearer ${token || ""}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

baseService.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        config.headers.Authorization = `Bearer ${token || ""}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

authService.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        if (error.response) {
            console.error("Auth service error:", error.response.data);

            if (error.response.status === 401) {
                Cookies.remove("token");

                // Redirect to login page or trigger auth refresh
                window.location.href = "/login";
                return Promise.reject("Session expired. Please login again.");
            }

            return Promise.reject(
                error.response.data.detail || "Authentication error"
            );
        } else {
            console.error("Network error:", error.message);
            return Promise.reject(error.message);
        }
    }
);