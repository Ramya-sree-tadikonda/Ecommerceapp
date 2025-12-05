package com.ramya.ecommerceapplication.product;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    ProductRepository productRepository;

    @InjectMocks
    ProductService productService;

    @Test
    void searchProductsForAdmin_shouldReturnPagedProducts() {
        // 👇 1. Arrange
        Product p = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("Test desc")
                .price(BigDecimal.TEN)
                .stock(5)
                .active(true)
                .build();

        Pageable pageable = PageRequest.of(0, 20);
        Page<Product> page = new PageImpl<>(List.of(p), pageable, 1);

        // 🧠 Stub the repository used inside ProductService
        when(productRepository.findAll(pageable)).thenReturn(page);

        // 👇 2. Act
        Page<Product> result = productService.searchProductsForAdmin(null, pageable);

        // 👇 3. Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Test Product");
    }
}
