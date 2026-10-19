import axios from "axios";
import { mockAdapter } from "./mocks/adapter";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  adapter: mockAdapter,
});

export default axiosInstance;
