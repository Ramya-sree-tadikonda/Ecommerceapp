
import httpClient from "./httpClient.js";

export function getProductsApi({ page = 0, size = 12, search = "" } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("size", size);
  if (search && search.trim() !== "") {
    params.set("search", search.trim());
  }

  return httpClient.get(`/api/products?${params.toString()}`);
}

export function getProductByIdApi(id) {
  return httpClient.get(`/api/products/${id}`);
}

// NEW: admin paginated list (all products)
export function getAdminProductsApi(
  axiosPrivate,
  { page = 0, size = 20, search = "" } = {}
) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("size", size);
  if (search && search.trim() !== "") {
    params.set("search", search.trim());
  }

  return axiosPrivate.get(`/api/products/admin?${params.toString()}`);
}

// admin CRUD
export function createProductApi(payload, axiosPrivate) {
  return axiosPrivate.post("/api/products", payload);
}

export function updateProductApi(id, payload, axiosPrivate) {
  return axiosPrivate.put(`/api/products/${id}`, payload);
}

export function deleteProductApi(id, axiosPrivate) {
  return axiosPrivate.delete(`/api/products/${id}`);
}
