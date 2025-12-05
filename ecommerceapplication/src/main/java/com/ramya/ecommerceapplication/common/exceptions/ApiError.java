package com.ramya.ecommerceapplication.common.exceptions;



import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class ApiError {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    private int status;          // HTTP status code, e.g. 400
    private String error;        // HTTP status reason, e.g. "Bad Request"
    private String message;      // Detailed message
    private String path;         // Request URI
}
