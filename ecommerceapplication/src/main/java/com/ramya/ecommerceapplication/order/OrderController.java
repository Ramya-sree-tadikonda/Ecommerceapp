package com.ramya.ecommerceapplication.order;

import com.ramya.ecommerceapplication.auth.User;
import com.ramya.ecommerceapplication.auth.UserRepository;
import com.ramya.ecommerceapplication.cart.CartItem;
import com.ramya.ecommerceapplication.cart.CartItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    /**
     * ✅ Get current user's orders
     *   GET /api/orders?sort=desc  (default, newest first)
     *   GET /api/orders?sort=asc   (oldest first)
     */
    @GetMapping
    public List<Order> getMyOrders(
            @RequestParam(defaultValue = "desc") String sort,
            Authentication auth
    ) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean desc = !"asc".equalsIgnoreCase(sort);

        if (desc) {
            return orderRepository.findByUserOrderByCreatedAtDesc(user);
        } else {
            return orderRepository.findByUserOrderByCreatedAtAsc(user);
        }
    }

    /**
     * ✅ Checkout:
     *  - assumes Stripe payment already succeeded on frontend
     *  - takes all cart items of current user
     *  - creates Order + OrderItems
     *  - clears cart
     *
     *  POST /api/orders/checkout
     */
    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<Order> checkout(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PAID);  // or PENDING, based on your flow

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(ci.getProduct());
            oi.setQuantity(ci.getQuantity());
            oi.setUnitPrice(ci.getProduct().getPrice()); // adjust type if needed

            orderItems.add(oi);

            BigDecimal lineTotal = ci.getProduct()
                    .getPrice()
                    .multiply(BigDecimal.valueOf(ci.getQuantity()));
            total = total.add(lineTotal);
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        // Clear cart
        cartItemRepository.deleteAll(cartItems);

        return ResponseEntity.ok(saved);
    }
}
