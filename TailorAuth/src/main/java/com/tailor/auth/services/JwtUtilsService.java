package com.tailor.auth.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;



@Service
public class JwtUtilsService {

    private final DateService dateService;

    public JwtUtilsService(DateService dateService) {
        this.dateService = dateService;
    }


    public String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration,
            Key secretKey) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(dateService.getCurrentDate())
                .setExpiration(dateService.getExpirationDate(expiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver, Key signInKey) {
        final Claims claims = Jwts
                                .parserBuilder()
                                .setSigningKey(signInKey)
                                .build()
                                .parseClaimsJws(token)
                                .getBody();
        return claimsResolver.apply(claims);
    }

    public Key generateKey(String secretKey) {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
}
