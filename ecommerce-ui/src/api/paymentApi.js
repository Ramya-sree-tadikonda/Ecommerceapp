import httpClient from "./httpClient.js";

export function createPaymentIntentApi(axiosPrivate) {
  return axiosPrivate.post("/api/payments/create-intent");
}
