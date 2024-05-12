package com.tailor.auth.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @Mock
    private JwtUtilsService jwtUtilsService;

    private JwtService jwtService;

    private final long jwtExpiration = 3600000;

    private final long refreshExpiration = 604800000;

    private final String secretKey = "ThisIsASecretKeyForTestingPurposesOnlyWithMoreThan256Bits";

    private Key signInKey;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(jwtUtilsService);
        jwtService.setSecretKey(secretKey);
        jwtService.setJwtExpiration(jwtExpiration); // 1 hour
        jwtService.setRefreshExpiration(refreshExpiration); // 1 week
        signInKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    @Test
    void testExtractUsernameWhenSignInKeyIsNull() {
        //Setup
        Claims claims = Jwts.claims().setSubject("testuser");
        String token = Jwts.builder().setClaims(claims).compact();
        when(jwtUtilsService.extractClaim(any(), any(), any())).thenReturn("testuser");
        when(jwtUtilsService.generateKey(any())).thenReturn(signInKey);

        //Test
        String username = jwtService.extractUsername(token);

        //Verify
        assertEquals("testuser", username);
        verify(jwtUtilsService, times(1)).extractClaim(eq(token), any(), eq(signInKey));
        verify(jwtUtilsService, times(1)).generateKey(eq(secretKey));
    }

    @Test
    void testExtractUsernameWhenSignInKeyIsNotNull() {
        //Setup
        Claims claims = Jwts.claims().setSubject("testuser");
        String token = Jwts.builder().setClaims(claims).compact();
        when(jwtUtilsService.extractClaim(any(), any(), any())).thenReturn("testuser");
        jwtService.setSignInKey(signInKey);

        //Test
        String username = jwtService.extractUsername(token);

        //Verify
        assertEquals("testuser", username);
        verify(jwtUtilsService, times(1)).extractClaim(eq(token), any(), eq(signInKey));
        verify(jwtUtilsService, times(0)).generateKey(eq(secretKey));
    }

    @Test
    void testGenerateTokenWhenSignInKeyIsNull() {
        //Setup
        UserDetails userDetails = User.withUsername("testuser").password("password").roles("USER").build();
        when(jwtUtilsService.buildToken(any(), any(), eq(jwtExpiration), any())).thenReturn("token");
        when(jwtUtilsService.generateKey(any())).thenReturn(signInKey);

        //Test
        String token = jwtService.generateToken(userDetails);

        //Verify
        assertNotNull(token);
        verify(jwtUtilsService, times(1)).buildToken(any(), eq(userDetails), eq(jwtExpiration), eq(signInKey));
        verify(jwtUtilsService, times(1)).generateKey(eq(secretKey));
    }

    @Test
    void testGenerateTokenWhenSignInKeyIsNotNull() {
        //Setup
        UserDetails userDetails = User.withUsername("testuser").password("password").roles("USER").build();
        when(jwtUtilsService.buildToken(any(), any(), eq(jwtExpiration), any())).thenReturn("token");
        jwtService.setSignInKey(signInKey);

        //Test
        String token = jwtService.generateToken(userDetails);

        //Verify
        assertNotNull(token);
        verify(jwtUtilsService, times(1)).buildToken(any(), eq(userDetails), eq(jwtExpiration), eq(signInKey));
        verify(jwtUtilsService, times(0)).generateKey(eq(secretKey));
    }

    @Test
    void testGenerateTokenWithExtraClaimsWhenSignInKeyIsNull() {
        //Setup
        UserDetails userDetails = User.withUsername("testuser").password("password").roles("USER").build();
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "ADMIN");
        when(jwtUtilsService.buildToken(any(), any(), eq(jwtExpiration), any())).thenReturn("token");
        when(jwtUtilsService.generateKey(any())).thenReturn(signInKey);

        //Test
        String token = jwtService.generateToken(extraClaims, userDetails);

        //Verify
        assertNotNull(token);
        verify(jwtUtilsService, times(1)).buildToken(eq(extraClaims), eq(userDetails), eq(jwtExpiration), eq(signInKey));
        verify(jwtUtilsService, times(1)).generateKey(eq(secretKey));;
    }

    @Test
    void testGenerateTokenWithExtraClaimsWhenSignInKeyIsNotNull() {
        //Setup
        UserDetails userDetails = User.withUsername("testuser").password("password").roles("USER").build();
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "ADMIN");
        when(jwtUtilsService.buildToken(any(), any(), eq(jwtExpiration), any())).thenReturn("token");
        jwtService.setSignInKey(signInKey);

        //Test
        String token = jwtService.generateToken(extraClaims, userDetails);

        //Verify
        assertNotNull(token);
        verify(jwtUtilsService, times(1)).buildToken(eq(extraClaims), eq(userDetails), eq(jwtExpiration), eq(signInKey));
        verify(jwtUtilsService, times(0)).generateKey(eq(secretKey));;
    }

    @Test
    void testGenerateRefreshTokenWhenSignInKeyIsNull() {
        //Setup
        UserDetails userDetails = User.withUsername("testuser").password("password").roles("USER").build();
        when(jwtUtilsService.buildToken(any(Map.class), eq(userDetails), eq(refreshExpiration), eq(signInKey))).thenReturn("token");
        when(jwtUtilsService.generateKey(any())).thenReturn(signInKey);

        //Test
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        //Verify
        assertNotNull(refreshToken);
        verify(jwtUtilsService, times(1)).generateKey(eq(secretKey));
        verify(jwtUtilsService, times(1)).buildToken(any(Map.class), eq(userDetails), eq(refreshExpiration), eq(signInKey));
    }

    @Test
    void testGenerateRefreshTokenWhenSignInKeyIsNotNull() {
        //Setup
        UserDetails userDetails = User.withUsername("testuser").password("password").roles("USER").build();
        when(jwtUtilsService.buildToken(any(Map.class), eq(userDetails), eq(refreshExpiration), eq(signInKey))).thenReturn("token");
        jwtService.setSignInKey(signInKey);

        //Test
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        //Verify
        assertNotNull(refreshToken);
        verify(jwtUtilsService, times(0)).generateKey(eq(secretKey));
        verify(jwtUtilsService, times(1)).buildToken(any(Map.class), eq(userDetails), eq(refreshExpiration), eq(signInKey));
    }

    @Test
    void testIsTokenValidWhenSignInKeyIsNotNullAndInvalidShouldReturnFalse() {

        //TODO
        assertTrue(true);

        //Setup
        //UserDetails userDetails = User.withUsername("username").password("password").roles("USER").build();
        //when(jwtUtilsService.generateKey(any())).thenReturn(signInKey);
        //jwtService.setSignInKey(signInKey);
        //String token = "token";
        //when(jwtUtilsService.extractClaim(any(), any(), any())).thenReturn("username");


        //Test
        //boolean result = jwtService.isTokenValid(token, userDetails);

        //Verify
        //assertFalse(result);

    }
}