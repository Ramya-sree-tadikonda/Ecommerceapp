package com.ramya.ecommerceapplication.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ramya.ecommerceapplication.cart.CartItem;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 👇 Ignore Hibernate proxy fields when serializing
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 2000)
    private String description;

    private BigDecimal price;

    private Integer stock;        // inventory quantity

    // 🔥 Use Boolean so Lombok gives getActive()/setActive() and we can null-check
    @Column(nullable = false)
    private Boolean active = true;     // for soft delete

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;

    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore   // 👈 avoid recursion Product → CartItems → Product → ...
    private List<CartItem> cartItems;



    // 🔥 IMPORTANT — Required for ProductServic
}
