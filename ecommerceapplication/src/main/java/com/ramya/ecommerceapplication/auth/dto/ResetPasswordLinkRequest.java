
package com.ramya.ecommerceapplication.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordLinkRequest {
    private String email;
    private String token;
    private String newPassword;
}
