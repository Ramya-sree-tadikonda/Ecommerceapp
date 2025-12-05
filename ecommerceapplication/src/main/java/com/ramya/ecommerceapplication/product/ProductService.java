package com.ramya.ecommerceapplication.product;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // 🔍 For admin, with optional search and pagination
    public Page<Product> searchProductsForAdmin(String search, Pageable pageable) {
        if (search == null || search.isBlank()) {
            return productRepository.findAll(pageable);
        }
        return productRepository.findByNameContainingIgnoreCase(search, pageable);
    }

    public Product createProduct(Product product) {
        // ensure active is not null (default true)
        if (product.getActive() == null) {
            product.setActive(true);
        }

        // default price if not provided
        if (product.getPrice() == null) {
            product.setPrice(BigDecimal.ZERO);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updated) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id " + id));

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setStock(updated.getStock());
        existing.setActive(updated.getActive());

        return productRepository.save(existing);
    }

    // 👇 Soft delete: mark inactive instead of deleting row
    public void softDeleteProduct(Long id) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id " + id));

        existing.setActive(false);
        productRepository.save(existing);
    }

    // 👉 keep user-side methods here if you have them
    // public Page<Product> getActiveProducts(Pageable pageable) { ... }
    // public Product getProductById(Long id) { ... }
}
