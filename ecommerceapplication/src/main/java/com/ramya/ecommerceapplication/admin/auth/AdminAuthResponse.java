
package com.ramya.ecommerceapplication.admin.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminAuthResponse {
    private String accessToken;
    private String refreshToken;
}
