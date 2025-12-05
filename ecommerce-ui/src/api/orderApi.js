// src/api/orderApi.js

// USER: get own orders (with sort)
export function getOrdersApi(axiosPrivate, sort = "desc") {
  return axiosPrivate.get(`/api/orders?sort=${sort}`);
}

export function checkoutApi(axiosPrivate) {
  return axiosPrivate.post("/api/orders/checkout");
}

// ADMIN: list all orders
export function getAdminOrdersApi(axiosPrivate, sort = "desc") {
  return axiosPrivate.get(`/api/admin/orders?sort=${sort}`);
}

// ADMIN: update order status
export function updateAdminOrderStatusApi(axiosPrivate, orderId, status) {
  return axiosPrivate.patch(
    `/api/admin/orders/${orderId}/status?status=${status}`
  );
}
