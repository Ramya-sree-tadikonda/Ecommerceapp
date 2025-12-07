

// Get current user's cart
export function getCartApi(axiosPrivate) {
  return axiosPrivate.get("/api/cart");
}

// Add product to cart  -> POST /api/cart/add
export function addToCartApi(axiosPrivate, productId, quantity = 1) {
  return axiosPrivate.post("/api/cart/add", {
    productId,
    quantity,
  });
}

// Update cart item quantity -> PUT /api/cart/update
export function updateCartItemApi(axiosPrivate, productId, quantity) {
  return axiosPrivate.put("/api/cart/update", {
    productId,
    quantity,
  });
}

// Remove item from cart -> DELETE /api/cart/remove/{productId}
export function removeCartItemApi(axiosPrivate, productId) {
  return axiosPrivate.delete(`/api/cart/remove/${productId}`);
}
