
//just for testing
package com.ramya.ecommerceapplication.user;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/me")
    public String me(Authentication authentication) {
        // authentication.getName() = email from UserDetails
        return "Hello, " + authentication.getName();
    }
}
