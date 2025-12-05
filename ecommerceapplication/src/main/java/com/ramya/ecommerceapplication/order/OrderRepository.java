package com.ramya.ecommerceapplication.order;

import com.ramya.ecommerceapplication.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    List<Order> findByUserOrderByCreatedAtAsc(User user);


    // ---------- ADMIN / STATS QUERIES ----------
    // Total revenue (sum of all order totals)
    @Query("select coalesce(sum(o.totalAmount), 0) from Order o")
    BigDecimal sumTotalAmount();

    // Count by status (e.g., PAID, SHIPPED, CANCELLED)
    long countByStatus(OrderStatus status);

    // Count orders created after a given time (e.g., today)
    @Query("select count(o) from Order o where o.createdAt >= :from")
    long countCreatedAfter(LocalDateTime from);
}
