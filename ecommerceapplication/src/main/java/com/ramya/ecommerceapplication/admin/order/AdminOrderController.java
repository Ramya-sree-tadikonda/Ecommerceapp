// src/main/java/com/ramya/ecommerceapplication/admin/order/AdminOrderController.java
package com.ramya.ecommerceapplication.admin.order;

import com.ramya.ecommerceapplication.order.Order;
import com.ramya.ecommerceapplication.admin.order.AdminOrderService;
import com.ramya.ecommerceapplication.order.OrderStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    // list all orders (with sort) – already similar to what we discussed
    @GetMapping
    public ResponseEntity<List<AdminOrderDto>> getAllOrders(
            @RequestParam(defaultValue = "desc") String sort
    ) {
        boolean newestFirst = !"asc".equalsIgnoreCase(sort);
        List<Order> orders = adminOrderService.findAllOrdersSortedByDate(newestFirst);

        List<AdminOrderDto> dtoList = orders.stream()
                .map(AdminOrderDto::fromEntity)
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    // 🔹 update order status (PAID / SHIPPED / DELIVERED / CANCELLED etc.)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam("status") OrderStatus status
    ) {
        adminOrderService.updateStatus(id, status);
        return ResponseEntity.ok("Order status updated to " + status.name());
    }

    @Getter
    @Setter
    public static class AdminOrderItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private int quantity;
        private BigDecimal unitPrice;
    }

    @Getter
    @Setter
    public static class AdminOrderDto {
        private Long id;
        private String userEmail;
        private String status;
        private BigDecimal totalAmount;
        private String createdAt;
        private List<AdminOrderItemDto> items;

        public static AdminOrderDto fromEntity(Order order) {
            AdminOrderDto dto = new AdminOrderDto();
            dto.setId(order.getId());
            dto.setUserEmail(order.getUser() != null ? order.getUser().getEmail() : null);
            dto.setStatus(order.getStatus() != null ? order.getStatus().name() : null);
            dto.setTotalAmount(order.getTotalAmount());
            dto.setCreatedAt(order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);

            dto.setItems(order.getItems().stream().map(oi -> {
                AdminOrderItemDto itemDto = new AdminOrderItemDto();
                itemDto.setId(oi.getId());
                itemDto.setProductId(oi.getProduct() != null ? oi.getProduct().getId() : null);
                itemDto.setProductName(oi.getProduct() != null ? oi.getProduct().getName() : null);
                itemDto.setQuantity(oi.getQuantity());
                itemDto.setUnitPrice(oi.getUnitPrice());
                return itemDto;
            }).toList());

            return dto;
        }
    }
}
