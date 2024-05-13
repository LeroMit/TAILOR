package com.tailor.auth;

import com.tailor.auth.models.AuthenticationResponse;
import com.tailor.auth.services.AuthenticationService;
import com.tailor.auth.models.RegisterRequest;

import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import static com.tailor.auth.user.Role.ADMIN;

@SpringBootApplication
@Slf4j
public class TailorApplication {

	public static void main(String[] args) {
		SpringApplication.run(TailorApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
			AuthenticationService service) {
		return args -> {
			RegisterRequest admin = RegisterRequest.builder()
					.id(Long.valueOf(123))
					.email("admin@mail.com")
					.username("admin123")
					.password("password")
					.role(ADMIN)
					.build();
			AuthenticationResponse result = service.register(admin);
			log.info("Admin token: " + result.getAccessToken());
			log.info("Admin refresh token: " + result.getRefreshToken());
		};
	}
}
