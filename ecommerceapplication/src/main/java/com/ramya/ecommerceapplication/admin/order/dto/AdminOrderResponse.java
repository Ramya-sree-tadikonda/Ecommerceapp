


package com.ramya.ecommerceapplication.admin.order.dto;

import com.ramya.ecommerceapplication.order.OrderStatus;
import lombok.*;

        import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOrderResponse {
    private Long id;
    private String userEmail;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private List<AdminOrderItemResponse> items;
}
