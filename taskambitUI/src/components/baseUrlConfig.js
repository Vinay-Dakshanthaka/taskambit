import axios from "axios";

// Define baseURL variable
export const baseURL = "http://localhost:3002";

// Create axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
