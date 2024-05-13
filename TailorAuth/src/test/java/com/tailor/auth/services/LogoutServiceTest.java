package com.tailor.auth.services;

import com.tailor.auth.token.Token;
import com.tailor.auth.token.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LogoutServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private Authentication authentication;

    private MockedStatic<SecurityContextHolder> mockedSecurityContextHolder;

    @Mock
    private SecurityContext securityContextMock;

    private LogoutService logoutService;

    @BeforeEach
    void setUp() {
        logoutService = new LogoutService(tokenRepository);
        SecurityContextHolder.setContext(securityContextMock);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void testLogoutWithValidToken() {
        String jwt = "Bearer validToken";
        Token token = new Token();
        when(request.getHeader("Authorization")).thenReturn(jwt);
        when(tokenRepository.findByToken("validToken")).thenReturn(Optional.of(token));

        logoutService.logout(request, response, authentication);

        verify(tokenRepository, times(1)).save(token);
        verifySecurityContextCleared();
    }

    @Test
    void testLogoutWithInvalidToken() {
        String jwt = "Bearer invalidToken";
        when(request.getHeader("Authorization")).thenReturn(jwt);
        when(tokenRepository.findByToken("invalidToken")).thenReturn(Optional.empty());

        logoutService.logout(request, response, authentication);

        verify(tokenRepository, never()).save(any());
        verifySecurityContextNotCleared();
    }

    @Test
    void testLogoutWithoutAuthorizationHeader() {
        when(request.getHeader("Authorization")).thenReturn(null);

        logoutService.logout(request, response, authentication);

        verifyNoInteractions(tokenRepository);
        verifySecurityContextNotCleared();
    }

    private void verifySecurityContextCleared() {
        verify(securityContextMock, times(1)).setAuthentication(null);
    }

    private void verifySecurityContextNotCleared() {
        verify(securityContextMock, never()).setAuthentication(null);
    }
}