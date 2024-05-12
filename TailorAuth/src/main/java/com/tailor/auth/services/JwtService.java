package com.tailor.auth.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParserBuilder;
import io.jsonwebtoken.Jwts;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Getter
@Service
public class JwtService {

  @Setter
  @Value("${application.security.jwt.secret-key}")
  private String secretKey;

  @Setter
  @Value("${application.security.jwt.expiration}")
  private long jwtExpiration;

  @Setter
  @Value("${application.security.jwt.refresh-token.expiration}")
  private long refreshExpiration;

  @Setter
  private JwtParserBuilder jwtParserBuilder;

  @Getter
  @Setter
  private Key signInKey;

  private final JwtUtilsService jwtUtilsService;

  public JwtService(JwtUtilsService jwtUtilsService) {
      this.jwtParserBuilder = Jwts.parserBuilder();
      this.jwtUtilsService = jwtUtilsService;
  }

  public String extractUsername(String token) {
    if(signInKey == null) {
      signInKey = jwtUtilsService.generateKey(secretKey);
    }
    return jwtUtilsService.extractClaim(token, Claims::getSubject, signInKey);
  }

  public String generateToken(UserDetails userDetails) {
    if(signInKey == null) {
      signInKey = jwtUtilsService.generateKey(secretKey);
    }
    return jwtUtilsService.buildToken(new HashMap<>(), userDetails, jwtExpiration, signInKey);
  }

  public String generateToken(
    Map<String, Object> extraClaims,
    UserDetails userDetails) {
    if(signInKey == null) {
      signInKey = jwtUtilsService.generateKey(secretKey);
    }
    return jwtUtilsService.buildToken(extraClaims, userDetails, jwtExpiration, signInKey);
  }

  public String generateRefreshToken(
      UserDetails userDetails) {
    if(signInKey == null) {
      signInKey = jwtUtilsService.generateKey(secretKey);
    }
    return jwtUtilsService.buildToken(new HashMap<>(), userDetails, refreshExpiration, signInKey);
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = jwtUtilsService.extractClaim(token, Claims::getSubject, signInKey);
    if(signInKey == null) {
      signInKey = jwtUtilsService.generateKey(secretKey);
    }
    return (username.equals(userDetails.getUsername())) && !(jwtUtilsService.extractClaim(token, Claims::getExpiration, signInKey).before(new Date()));
  }
}
