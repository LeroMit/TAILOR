package org.tailor.api.tailorback.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.tailor.api.tailorback.models.Tag;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.UserRepository;
import org.tailor.api.tailorback.requests.UserRequest;
import org.tailor.api.tailorback.requests.AuthenticationResponse;
import org.tailor.api.tailorback.requests.RegisterRequest;

import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${tailor_auth_url}")
    private String tailorAuthUrl;

    @Autowired
    DTOMappingService dtoMappingService;

    public User createUser(UserRequest user, List<Tag> defaultTags) {
        log.debug("Creating user");

        User userToCreate = User.builder()
                .photoUrl("https://cdn-icons-png.flaticon.com/512/3541/3541871.png")
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .defaultTags(defaultTags)
                .bio("")
                .build();
        User created_user;
        try {
            created_user = userRepository.save(userToCreate);
        } catch (Exception e) {
            log.error("Error while creating user");
            return null;
        }

        AuthenticationResponse response = registerUser(user, created_user.getId());
        System.out.println(response);
        if (response == null) {
            log.error("Error while registering user");
            if (created_user != null) {
                userRepository.deleteById(created_user.getId());
            }
            return null;
        }

        log.debug("User " + created_user.getId() + " created");
        return created_user;
    }

    public Optional<User> getUser(Long id) {
        log.debug("Getting user with id " + id);
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            log.info("User not found in getUser");
            return Optional.empty();
        }
        return user;
    }

    public List<User> getUsers() {
        log.debug("Getting users");
        return userRepository.findAll();
    }

    public Optional<User> selectTailor(Long userId, Long tailorId) {
        log.debug("Assigning tailor " + tailorId + "to user id " + userId);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.info("User not found in selectTailor");
            return Optional.empty();
        }
        user.setSelectedTailorId(tailorId);
        User updated_user = userRepository.save(user);
        log.debug("User " + updated_user.getId() + " updated");
        return Optional.of(updated_user);
    }

    public AuthenticationResponse registerUser(UserRequest userRequest, Long userId) {
        String authApiUrl = tailorAuthUrl + "/api/v1/auth/register";

        RegisterRequest registerRequest = RegisterRequest.builder()
                .id(userId)
                .email(userRequest.getEmail())
                .username(userRequest.getUsername())
                .password(userRequest.getPassword())
                .role("USER")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<RegisterRequest> request = new HttpEntity<>(registerRequest, headers);

        ResponseEntity<AuthenticationResponse> response = restTemplate.postForEntity(authApiUrl, request,
                AuthenticationResponse.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            log.debug("User registered successfully");
            return response.getBody();
        } else {
            log.error("Failed to register user");
        }

        return null;
    }

    // TODO
    // public User updateUser(Long id, UserRequest user) {
    // log.info("Updating user with id " + id);
    // User userToUpdate = userRepository.findById(id).orElse(null);
    // if (userToUpdate == null) {
    // return null;
    // }
    // userToUpdate.setBio(user.getBio());
    // userToUpdate.setPhotoUrl(user.getPhotoUrl());
    // User updated_user = userRepository.save(userToUpdate);
    // log.info("User " + updated_user.getId() + " updated");
    // return updated_user;
    // }

    public User updateUserSelectedTailor(Long id, Long tailorId) {
        log.info("Updating user with id " + id);
        User userToUpdate = userRepository.findById(id).orElse(null);
        if (userToUpdate == null) {
            return null;
        }
        userToUpdate.setSelectedTailorId(tailorId);
        User updated_user = userRepository.save(userToUpdate);
        log.info("User " + updated_user.getId() + " updated");
        return updated_user;
    }
}
