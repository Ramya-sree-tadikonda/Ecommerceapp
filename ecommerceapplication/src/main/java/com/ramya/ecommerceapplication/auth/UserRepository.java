package com.ramya.ecommerceapplication.auth;

import com.ramya.ecommerceapplication.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // 👇 NEW: for admin username uniqueness
    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);
}
