package com.ramya.ecommerceapplication.auth.service;

import com.ramya.ecommerceapplication.admin.auth.Role;
import com.ramya.ecommerceapplication.auth.User;
import com.ramya.ecommerceapplication.auth.UserRepository;
import com.ramya.ecommerceapplication.auth.dto.*;

import com.ramya.ecommerceapplication.auth.jwt.JwtService;
import com.ramya.ecommerceapplication.common.email.EmailService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public String signup(SignupRequest request) {
        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email already registered"
            );
        }

        // 2. Encode password
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        System.out.println("DEBUG encoded password = " + encodedPassword);



        // Simple rule: if fullName ends with "_admin" → ADMIN, else USER
        Role role = Role.USER;
        if (request.getFullName() != null &&
                request.getFullName().toLowerCase().endsWith("_admin")) {
            role = Role.ADMIN;
        }



        // 3. Generate OTP + expiry
        String otp = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        System.out.println("DEBUG: Generated OTP for " + request.getEmail() + " = " + otp);
        System.out.println("DEBUG: OTP expiry = " + expiry);

        // 4. Create user with OTP + not verified
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(encodedPassword)
                .role(role)
                .emailVerified(false)
                .otp(otp)
                .otpExpiry(expiry)
                .build();

        userRepository.save(user);

        System.out.println("DEBUG: User saved with ID = " + user.getId() +
                ", otp = " + user.getOtp() +
                ", otpExpiry = " + user.getOtpExpiry());

        // 5. Send OTP email
        emailService.sendOtpEmail(user.getEmail(), otp);

        return "User registered successfully. Please verify your email with the OTP sent.";
    }

    private String generateOtp() {
        int otp = (int) (Math.random() * 900000) + 100000;
        return String.valueOf(otp);
    }

    public AuthResponse signin(@Valid signinRequest request) {
        // 1. Check if user exists
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid email or password"
                ));

        // 2. Check password
        boolean matches = passwordEncoder.matches(
                request.getPassword(),      // raw password
                user.getPassword()          // encoded password
        );

        if (!matches) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid email or password"
            );
        }

        if (!user.isEmailVerified()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Please verify your email before logging in."
            );
        }

        // 3. (Later) check emailVerified, generate JWT, etc.
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .message("Login successful")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    //verify-email
    public String verifyEmail(VerifyEmailRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "User not found for this email"
                ));

        // already verified
        if (user.isEmailVerified()) {
            return "Email is already verified.";
        }

        // check OTP match
        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid OTP"
            );
        }

        // check expiry
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "OTP has expired. Please request a new one."
            );
        }

        // mark verified and clear otp
        user.setEmailVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return "Email verified successfully. You can now log in.";
    }

  // sends otp and reset password link to email
    //generate OTP again and send email
  public String forgotPassword(ForgotPasswordRequest request) {
      User user = userRepository.findByEmail(request.getEmail())
              .orElseThrow(() -> new ResponseStatusException(
                      HttpStatus.BAD_REQUEST,
                      "User not found for this email"
              ));

      //  Generate reset token (not OTP now)
      String token = java.util.UUID.randomUUID().toString();
      LocalDateTime expiry = LocalDateTime.now().plusMinutes(30);

      user.setResetToken(token);
      user.setResetTokenExpiry(expiry);
      userRepository.save(user);

      // Build reset link pointing to your frontend page
      String resetLink = "http://localhost:5176/reset-password?token=" + token +
              "&email=" + user.getEmail();

      System.out.println("DEBUG reset link: " + resetLink);

      emailService.sendPasswordResetLink(user.getEmail(), resetLink);

      return "Password reset link has been sent to your email.";
  }



  //resent otp
    public String resendOtp(ResendOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "User not found for this email"
                ));

        if (user.isEmailVerified()) {
            return "Email is already verified. No need to resend OTP.";
        }

        String otp = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        user.setOtp(otp);
        user.setOtpExpiry(expiry);
        userRepository.save(user);

        System.out.println("DEBUG: Resend OTP for " + user.getEmail() + " = " + otp);

        emailService.sendOtpEmail(user.getEmail(), otp);

        return "A new OTP has been sent to your email.";
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        String email;
        try {
            email = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid refresh token"
            );
        }

        if (!jwtService.isTokenValid(refreshToken, email) ||
                !jwtService.isRefreshToken(refreshToken)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or expired refresh token"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found for this token"
                ));

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user); // you can rotate or reuse

        return AuthResponse.builder()
                .message("Token refreshed successfully")
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    public String resetPasswordViaLink(ResetPasswordLinkRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "User not found for this email"
                ));

        if (user.getResetToken() == null || !user.getResetToken().equals(request.getToken())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid or expired reset token"
            );
        }

        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Reset token has expired. Please request a new one."
            );
        }

        // Encode and update password
        String encoded = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encoded);

        // Clear reset token
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return "Password reset successful. You can now log in with your new password.";
    }


}
