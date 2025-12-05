package com.ramya.ecommerceapplication.auth.dto;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class signinRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}
