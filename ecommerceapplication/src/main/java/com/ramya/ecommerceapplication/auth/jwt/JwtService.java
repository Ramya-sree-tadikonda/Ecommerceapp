package com.ramya.ecommerceapplication.auth.jwt;


import com.ramya.ecommerceapplication.auth.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // In real apps, move this to config / env variable.
    private static final String SECRET_KEY = "8Lxqa6gdbtj09HXHG71cKVSwtsGHBGkWGo2kPIeJQQQ=";

    // 15 minutes access token
    private final long ACCESS_TOKEN_EXPIRATION_MS = 15 * 60 * 1000;

    // 7 days refresh token
    private final long REFRESH_TOKEN_EXPIRATION_MS = 7L * 24 * 60 * 60 * 1000;

    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole()); // "USER" or "ADMIN"

        return buildToken(claims, user.getEmail(), ACCESS_TOKEN_EXPIRATION_MS);
    }

    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        claims.put("type", "refresh");

        return buildToken(claims, user.getEmail(), REFRESH_TOKEN_EXPIRATION_MS);
    }

    private String buildToken(Map<String, Object> extraClaims, String subject, long expirationMs) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    // ---------- New helper methods ----------

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject); // subject = email
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenValid(String token, String userEmail) {
        String username = extractUsername(token);
        return username.equals(userEmail) && !isTokenExpired(token);
    }

    public boolean isRefreshToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object type = claims.get("type");
            return type != null && "refresh".equals(type.toString());
        } catch (Exception e) {
            return false;
        }
    }
}
