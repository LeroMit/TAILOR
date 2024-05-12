package org.tailor.api.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tailor.api.tailorback.models.Tag;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.UserRepository;
import org.tailor.api.tailorback.requests.UserRequest;
import org.tailor.api.tailorback.services.DTOMappingService;
import org.tailor.api.tailorback.services.UserService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private DTOMappingService dtoMappingService;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserRequest userRequest;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).bio("Test bio").photoUrl("test.jpg").build();
        List<Long> defaultTagsIds = Arrays.asList(1L, 2L, 3L, 4L, 5L);
        userRequest = new UserRequest("admin@mail.com", "MotdePasse", "MotdePasse", "Clement", "VIAL", "clem1411",
                defaultTagsIds);
    }

    @Test
    void createUser_shouldReturnCreatedUser() {
        when(userRepository.save(any(User.class))).thenReturn(user);

        User createdUser = userService.createUser(userRequest, Arrays.asList(new Tag(), new Tag(), new Tag(), new Tag(), new Tag()));

        assertNotNull(createdUser);
        assertEquals(user.getId(), createdUser.getId());
        assertEquals(user.getBio(), createdUser.getBio());
        assertEquals(user.getPhotoUrl(), createdUser.getPhotoUrl());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void getUser_shouldReturnUserWhenFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> retrievedUser = userService.getUser(1L);

        assertTrue(retrievedUser.isPresent());
        assertEquals(user.getId(), retrievedUser.get().getId());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUser_shouldReturnEmptyOptionalWhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<User> retrievedUser = userService.getUser(1L);

        assertFalse(retrievedUser.isPresent());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUsers_shouldReturnListOfUsers() {
        List<User> userList = Arrays.asList(user);
        when(userRepository.findAll()).thenReturn(userList);

        List<User> retrievedUsers = userService.getUsers();

        assertNotNull(retrievedUsers);
        assertEquals(1, retrievedUsers.size());
        assertEquals(user.getId(), retrievedUsers.get(0).getId());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void selectTailor_shouldReturnUpdatedUserWhenUserFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        Optional<User> updatedUser = userService.selectTailor(1L, 2L);

        assertTrue(updatedUser.isPresent());
        assertEquals(2L, updatedUser.get().getSelectedTailorId());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void selectTailor_shouldReturnEmptyOptionalWhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<User> updatedUser = userService.selectTailor(1L, 2L);

        assertFalse(updatedUser.isPresent());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, never()).save(any(User.class));
    }
}