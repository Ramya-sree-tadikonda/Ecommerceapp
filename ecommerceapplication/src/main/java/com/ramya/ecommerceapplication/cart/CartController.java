package com.ramya.ecommerceapplication.cart;

import com.ramya.ecommerceapplication.auth.User;
import com.ramya.ecommerceapplication.auth.UserRepository;
import com.ramya.ecommerceapplication.cart.dto.AddToCartRequest;
import com.ramya.ecommerceapplication.product.Product;
import com.ramya.ecommerceapplication.product.ProductRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartController(CartItemRepository cartItemRepository,
                          UserRepository userRepository,
                          ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // ✅ Get current user's cart
    @GetMapping
    public List<CartItem> getMyCart(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartItemRepository.findByUser(user);
    }

    // ✅ Add or increase quantity
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request,
                                       Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByUserAndProduct(user, product)
                .orElse(CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(0)
                        .build());

        item.setQuantity(item.getQuantity() + request.getQuantity());
        cartItemRepository.save(item);

        return ResponseEntity.ok().body("Item added to cart");
    }

    // ✅ Update quantity
    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@Valid @RequestBody AddToCartRequest request,
                                            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return ResponseEntity.ok().body("Cart item updated");
    }

    // ✅ Remove item
    @Transactional
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId,
                                            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // find the cart item first
        CartItem item = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        cartItemRepository.delete(item);
        return ResponseEntity.ok().body("Item removed from cart");
    }
}
