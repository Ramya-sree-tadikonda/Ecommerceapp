package com.ramya.ecommerceapplication.admin.auth;

import com.ramya.ecommerceapplication.auth.User;
import com.ramya.ecommerceapplication.auth.UserRepository;


import com.ramya.ecommerceapplication.auth.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void signup(AdminSignupRequest request) {
        // username must end with _admin
        if (!request.getUsername().endsWith("_admin")) {
            throw new IllegalArgumentException("Admin username must end with _admin");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User admin = new User();
        admin.setUsername(request.getUsername());
        admin.setEmail(request.getEmail());
        admin.setFullName(request.getFullName());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole(Role.ADMIN);   // enum

        userRepository.save(admin);
    }

    public AdminAuthResponse login(AdminLoginRequest request) {
        User admin = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        // safer enum comparison
        if (admin.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Not an admin account");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        // use your existing JwtService methods
        String accessToken = jwtService.generateAccessToken(admin);
        String refreshToken = jwtService.generateRefreshToken(admin);

        return new AdminAuthResponse(accessToken, refreshToken);
    }
}
