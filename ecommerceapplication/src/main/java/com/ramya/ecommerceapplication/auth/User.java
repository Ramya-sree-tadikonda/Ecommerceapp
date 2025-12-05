package com.ramya.ecommerceapplication.auth;



import com.ramya.ecommerceapplication.admin.auth.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    // Password will be encoded later
    @Column(nullable = false)
    private String password;

    // ENUM role
    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean emailVerified;

    // For OTP (will use later)
    private String otp;

    private LocalDateTime otpExpiry;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    @Column(unique = true)
    private String username;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        emailVerified = false;
        if (role == null) {
            role = Role.USER;   // default user
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
