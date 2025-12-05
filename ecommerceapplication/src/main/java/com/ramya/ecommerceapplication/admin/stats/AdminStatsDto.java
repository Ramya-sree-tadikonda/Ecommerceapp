


package com.ramya.ecommerceapplication.admin.stats;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class AdminStatsDto {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long todayOrders;
    private long paidOrders;
    private long shippedOrders;
    private long cancelledOrders;
}