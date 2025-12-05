import axios from "axios";
import { API_BASE } from "../utils/api";



const httpClient = axios.create({
  baseURL: API_BASE,          
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpClient;
