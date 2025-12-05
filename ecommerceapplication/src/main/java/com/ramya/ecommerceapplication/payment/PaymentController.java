package com.ramya.ecommerceapplication.payment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

        import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // POST /api/payments/create-intent
    @PostMapping("/create-intent")
    public ResponseEntity<?> createPaymentIntent(Authentication auth) {
        try {
            String clientSecret = paymentService.createPaymentIntentForCurrentUser(auth);
            return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }
}
