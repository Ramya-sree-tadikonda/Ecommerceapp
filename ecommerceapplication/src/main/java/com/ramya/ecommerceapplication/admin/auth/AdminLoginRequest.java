package com.ramya.ecommerceapplication.admin.auth;



import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminLoginRequest {
    private String username;
    private String password;
}
