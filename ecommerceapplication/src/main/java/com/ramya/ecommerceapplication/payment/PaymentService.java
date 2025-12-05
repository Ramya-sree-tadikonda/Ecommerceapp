package com.ramya.ecommerceapplication.payment;
import com.ramya.ecommerceapplication.auth.User;
import com.ramya.ecommerceapplication.auth.UserRepository;
import com.ramya.ecommerceapplication.cart.CartItem;
import com.ramya.ecommerceapplication.cart.CartItemRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PaymentService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.currency:usd}")
    private String currency;

    public PaymentService(CartItemRepository cartItemRepository,
                          UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    // Calculate total amount (USD → cents) from current user's cart
    private long calculateCartTotalInCents(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cartItems) {
            BigDecimal price = ci.getProduct().getPrice();
            BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(ci.getQuantity()));
            total = total.add(lineTotal);
        }

        // convert to cents
        return total.multiply(BigDecimal.valueOf(100)).longValue();
    }

    public String createPaymentIntentForCurrentUser(Authentication auth) throws Exception {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long amountInCents = calculateCartTotalInCents(user);
        if (amountInCents <= 0) {
            throw new IllegalStateException("Cart is empty or total is zero.");
        }

        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(currency)
                .build();

        PaymentIntent intent = PaymentIntent.create(params);
        return intent.getClientSecret();
    }
}
