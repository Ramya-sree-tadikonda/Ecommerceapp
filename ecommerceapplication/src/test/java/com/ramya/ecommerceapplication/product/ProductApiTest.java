package com.ramya.ecommerceapplication.product;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductApiTestAlternative {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    // Mock other dependent services if needed
    // @MockBean private AnotherService anotherService;

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void getProducts_shouldReturn200() throws Exception {
        Product p1 = new Product(1L, "Laptop", "High-end laptop", 1500.0);
        Product p2 = new Product(2L, "Mouse", "Wireless mouse", 25.0);
        List<Product> products = Arrays.asList(p1, p2);

        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Laptop")))
                .andExpect(jsonPath("$[1].name", is("Mouse")));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void getProductById_shouldReturnProduct() throws Exception {
        Product product = new Product(1L, "Laptop", "High-end laptop", 1500.0);
        when(productService.getProductById(1L)).thenReturn(product);

        mockMvc.perform(get("/products/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Laptop")))
                .andExpect(jsonPath("$.price", is(1500.0)));
    }
}
