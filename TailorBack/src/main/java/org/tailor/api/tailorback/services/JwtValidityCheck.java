package org.tailor.api.tailorback.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.JwtParserBuilder;

import java.security.Key;
import java.time.Instant;
import java.util.Date;


public class JwtValidityCheck {

    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private JwtParserBuilder jwtParserBuilder;

    public static String getSecretKey() {
        return SECRET_KEY;
    }

    public JwtValidityCheck() {
        this.jwtParserBuilder = Jwts.parserBuilder();
    }

    public void setJwtParserBuilder(JwtParserBuilder jwtParserBuilder) {
        this.jwtParserBuilder = jwtParserBuilder;
    }

    public boolean checkJwtValidity(String jwt) {
        try {
            Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

            Jws<Claims> jws = jwtParserBuilder
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt);

            Date expirationDate = jws.getBody().getExpiration();

            return !expirationDate.before(Date.from(Instant.now()));
        } catch (Exception ex) {
            return false;
        }
    }
}