
import { useEffect } from "react";
import httpClient from "../api/httpClient.js"; 
import useAuth from "./useAuth.jsx";

export default function useAxiosPrivate() {
  const { auth } = useAuth(); // auth.accessToken should have the JWT

  useEffect(() => {
    // attach Authorization header on each request
    const requestInterceptor = httpClient.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && auth?.accessToken) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    
    return () => {
      httpClient.interceptors.request.eject(requestInterceptor);
    };
  }, [auth?.accessToken]);

  //  return the axios instance itself, not an object
  return httpClient;
}
