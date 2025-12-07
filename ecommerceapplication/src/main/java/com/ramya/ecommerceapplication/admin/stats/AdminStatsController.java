
package com.ramya.ecommerceapplication.admin.stats;

import com.ramya.ecommerceapplication.admin.order.AdminOrderService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStatsController {

    private final AdminOrderService adminOrderService;


    @GetMapping("/overview")
    public ResponseEntity<AdminStatsDto> getOverview() {
        AdminStatsDto dto = AdminStatsDto.builder()
                .totalOrders(adminOrderService.getTotalOrders())
                .totalRevenue(adminOrderService.getTotalRevenue())
                .todayOrders(adminOrderService.getTodayOrders())
                .paidOrders(adminOrderService.getPaidOrders())
                .shippedOrders(adminOrderService.getShippedOrders())
                .cancelledOrders(adminOrderService.getCancelledOrders())
                .build();

        return ResponseEntity.ok(dto);
    }
}
