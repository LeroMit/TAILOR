package org.tailor.api.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.tailor.api.tailorback.services.JwtValidityCheck;

class JwtValidityCheckTest {
    private JwtValidityCheck jwtValidityCheck;
    private Key key;

    @BeforeEach
    void setUp() {
        jwtValidityCheck = new JwtValidityCheck();
        key = Keys.hmacShaKeyFor(JwtValidityCheck.getSecretKey().getBytes());
    }

    @Test
    void testCheckJwtValidityWithValidJwt() {
        // Create a valid JWT
        String validJwt = Jwts.builder()
                .setSubject("subject")
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plusSeconds(3600)))
                .signWith(key)
                .compact();

        boolean isValid = jwtValidityCheck.checkJwtValidity(validJwt);
        assertTrue(isValid);
    }

    @Test
    void testCheckJwtValidityWithExpiredJwt() {
        // Create an expired JWT
        String expiredJwt = Jwts.builder()
                .setSubject("subject")
                .setIssuedAt(Date.from(Instant.now().minusSeconds(3600)))
                .setExpiration(Date.from(Instant.now().minusSeconds(1800)))
                .signWith(key)
                .compact();

        boolean isValid = jwtValidityCheck.checkJwtValidity(expiredJwt);
        assertFalse(isValid);
    }

    @Test
    void testCheckJwtValidityWithInvalidJwt() {
        // An invalid JWT string
        String invalidJwt = "invalid.jwt.string";

        boolean isValid = jwtValidityCheck.checkJwtValidity(invalidJwt);
        assertFalse(isValid);
    }
}