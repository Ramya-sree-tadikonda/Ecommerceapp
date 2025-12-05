package com.ramya.ecommerceapplication.admin.product.dto;



import java.math.BigDecimal;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Boolean active;
}
