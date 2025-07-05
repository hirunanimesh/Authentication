import axios from "axios";
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Include cookies in requests
});

export default api;