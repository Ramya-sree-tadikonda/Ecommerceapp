package com.ramya.ecommerceapplication.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Public: only active products
    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);

    // Admin: all products (active + inactive)
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);




}
