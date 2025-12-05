package com.ramya.ecommerceapplication.auth.dto;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String message;
    // Later we will add: private String accessToken; private String refreshToken;
    private String accessToken;
    private String refreshToken;


}
