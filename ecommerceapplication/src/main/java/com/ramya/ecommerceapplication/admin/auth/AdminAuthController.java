


package com.ramya.ecommerceapplication.admin.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5176") // adjust port if needed
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/signup")
    public ResponseEntity<?> adminSignup(@RequestBody AdminSignupRequest request) {
        adminAuthService.signup(request);
        return ResponseEntity.ok("Admin signup successful.");
    }

    @PostMapping("/login")
    public ResponseEntity<AdminAuthResponse> adminLogin(@RequestBody AdminLoginRequest request) {
        AdminAuthResponse tokens = adminAuthService.login(request);
        return ResponseEntity.ok(tokens);
    }
}

