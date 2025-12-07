package com.ramya.ecommerceapplication.product;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        // Clean DB before each test
        productRepository.deleteAll();
    }

    @Test
    void listProducts_returnsPageOfProducts() throws Exception {
        // Arrange: insert 2 products into H2 test DB
        Product p1 = Product.builder()
                .name("Laptop")
                .description("Gaming laptop")
                .price(BigDecimal.valueOf(999.99))
                .stock(10)
                .active(true)
                .build();

        Product p2 = Product.builder()
                .name("Phone")
                .description("Smartphone")
                .price(BigDecimal.valueOf(499.99))
                .stock(20)
                .active(true)
                .build();

        productRepository.save(p1);
        productRepository.save(p2);

        // Act + Assert
        mockMvc.perform(
                        get("/api/products")
                                .param("page", "0")
                                .param("size", "12")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].name").isNotEmpty())
                .andExpect(jsonPath("$.content[1].name").isNotEmpty());
    }

    @Test
    void getProductById_returnsProduct() throws Exception {
        // Arrange: save one product and use its generated ID
        Product saved = productRepository.save(
                Product.builder()
                        .name("Headphones")
                        .description("Noise cancelling")
                        .price(BigDecimal.valueOf(199.99))
                        .stock(5)
                        .active(true)
                        .build()
        );

        Long id = saved.getId();

        // Act + Assert
        mockMvc.perform(
                        get("/api/products/{id}", id)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value("Headphones"))
                .andExpect(jsonPath("$.description").value("Noise cancelling"))
                .andExpect(jsonPath("$.price").value(199.99));
    }

    @Test
    void getProductById_returns404_whenNotFound() throws Exception {
        // No product with ID 999 in fresh H2 DB
        mockMvc.perform(
                        get("/api/products/{id}", 999L)
                )
                .andExpect(status().isNotFound());
    }
}
