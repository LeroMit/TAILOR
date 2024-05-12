package com.tailor.auth.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtUtilsServiceTest {

    private static final String SECRET_KEY = "ThisIsASecretKeyForTestingPurposesOnlyWithMoreThan256Bits";
    private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds
    private static final String USERNAME = "testuser";

    @Mock
    private DateService dateServiceMock;

    private JwtUtilsService jwtUtilsService;
    private Key secretKey;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtUtilsService = new JwtUtilsService(dateServiceMock);
        secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        userDetails = User.withUsername(USERNAME).password("password").roles("USER").build();
    }

    @Test
    void testBuildToken() {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("claim1", "value1");

        Date currentDate = new Date();
        Date expirationDate = new Date(currentDate.getTime() + EXPIRATION_TIME);

        when(dateServiceMock.getCurrentDate()).thenReturn(currentDate);
        when(dateServiceMock.getExpirationDate(EXPIRATION_TIME)).thenReturn(expirationDate);

        String token = jwtUtilsService.buildToken(extraClaims, userDetails, EXPIRATION_TIME, secretKey);
        assertNotNull(token);
    }

    @Test
    void testExtractClaim() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("claim1", "value1");

        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(USERNAME)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();

        Function<Claims, String> claimsResolver = Claims::getSubject;
        String extractedClaim = jwtUtilsService.extractClaim(token, claimsResolver, secretKey);
        assertEquals(USERNAME, extractedClaim);
    }

    @Test
    void testGenerateKey() {
        Key key = jwtUtilsService.generateKey(SECRET_KEY);
        assertNotNull(key);
    }
}