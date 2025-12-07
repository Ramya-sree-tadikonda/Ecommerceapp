
package com.ramya.ecommerceapplication.admin.order;

import com.ramya.ecommerceapplication.order.Order;
import com.ramya.ecommerceapplication.order.OrderRepository;
import com.ramya.ecommerceapplication.order.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;

    // ---- list / sort ----
    public List<Order> findAllOrdersSortedByDate(boolean newestFirst) {
        Sort sort = Sort.by(newestFirst ? Sort.Direction.DESC : Sort.Direction.ASC, "createdAt");
        return orderRepository.findAll(sort);
    }

    // ---- update status ----
    public void updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        order.setStatus(status);
        orderRepository.save(order);
    }

    //  stats helpers
    public long getTotalOrders() {
        return orderRepository.count();
    }

    public BigDecimal getTotalRevenue() {
        return orderRepository.sumTotalAmount();
    }

    public long getTodayOrders() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        return orderRepository.countCreatedAfter(startOfDay);
    }

    public long getPaidOrders() {
        return orderRepository.countByStatus(OrderStatus.PAID);
    }

    public long getShippedOrders() {
        return orderRepository.countByStatus(OrderStatus.SHIPPED);
    }

    public long getCancelledOrders() {
        return orderRepository.countByStatus(OrderStatus.CANCELLED);
    }
}
