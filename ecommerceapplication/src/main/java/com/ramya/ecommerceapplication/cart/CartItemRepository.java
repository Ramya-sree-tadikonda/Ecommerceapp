package com.ramya.ecommerceapplication.cart;



import com.ramya.ecommerceapplication.auth.User;
import com.ramya.ecommerceapplication.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);


}
