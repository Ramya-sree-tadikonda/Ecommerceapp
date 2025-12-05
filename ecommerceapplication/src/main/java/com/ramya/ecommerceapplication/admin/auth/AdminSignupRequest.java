package com.ramya.ecommerceapplication.admin.auth;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminSignupRequest {
    private String username;  // must end with _admin
    private String email;
    private String password;
    private String fullName;
}
