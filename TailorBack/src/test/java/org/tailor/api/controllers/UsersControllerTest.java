package org.tailor.api.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.tailor.api.tailorback.controllers.UsersController;
import org.tailor.api.tailorback.dtos.user.UserDTO;
import org.tailor.api.tailorback.models.Tag;
import org.tailor.api.tailorback.models.User;
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
class UsersControllerTest {

    @Mock
    private DTOMappingService dtoMappingService;

    @Mock
    private UserService userService;

    @InjectMocks
    private UsersController usersController;

    private User user;
    private UserDTO userDTO;
    private UserRequest userRequest;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).build();
        userDTO = new UserDTO();
        userRequest = new UserRequest();
    }

    @Test
    void getUsers_shouldReturnListOfUserDTOs() {
        List<User> userList = Arrays.asList(user);
        when(userService.getUsers()).thenReturn(userList);
        when(dtoMappingService.listUserToListUserDTO(userList)).thenReturn(Arrays.asList(userDTO));

        ResponseEntity<List<UserDTO>> response = usersController.getUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(userService, times(1)).getUsers();
        verify(dtoMappingService, times(1)).listUserToListUserDTO(userList);
    }

    @Test
    void getUsers_shouldReturnNoContentWhenNoUsersFound() {
        when(userService.getUsers()).thenReturn(Arrays.asList());

        ResponseEntity<List<UserDTO>> response = usersController.getUsers();

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(userService, times(1)).getUsers();
        verify(dtoMappingService, never()).listUserToListUserDTO(any());
    }

    @Test
    void getUser_shouldReturnUserDTO() {
        when(userService.getUser(1L)).thenReturn(Optional.of(user));
        when(dtoMappingService.toUserDTO(user)).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = usersController.getUser(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userDTO, response.getBody());
        verify(userService, times(1)).getUser(1L);
        verify(dtoMappingService, times(1)).toUserDTO(user);
    }

    @Test
    void getUser_shouldReturnBadRequestWhenUserNotFound() {
        when(userService.getUser(1L)).thenReturn(Optional.empty());

        ResponseEntity<UserDTO> response = usersController.getUser(1L);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
        verify(userService, times(1)).getUser(1L);
        verify(dtoMappingService, never()).toUserDTO(any());
    }

    @Test
    void createUser_shouldReturnCreatedUserDTO() {
        when(userService.createUser(userRequest,  Arrays.asList(new Tag(), new Tag(), new Tag(), new Tag(), new Tag()))).thenReturn(user);
        when(dtoMappingService.toUserDTO(user)).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = usersController.createUser(userRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userDTO, response.getBody());
        verify(userService, times(1)).createUser(userRequest, Arrays.asList(new Tag(), new Tag(), new Tag(), new Tag(), new Tag()));
        verify(dtoMappingService, times(1)).toUserDTO(user);
    }

    @Test
    void selectTailor_shouldReturnUpdatedUserDTO() {
        when(userService.selectTailor(1L, 2L)).thenReturn(Optional.of(user));
        when(dtoMappingService.toUserDTO(user)).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = usersController.selectTailor(1L, 2L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userDTO, response.getBody());
        verify(userService, times(1)).selectTailor(1L, 2L);
        verify(dtoMappingService, times(1)).toUserDTO(user);
    }

    @Test
    void selectTailor_shouldReturnBadRequestWhenUserNotFound() {
        when(userService.selectTailor(1L, 2L)).thenReturn(Optional.empty());

        ResponseEntity<UserDTO> response = usersController.selectTailor(1L, 2L);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
        verify(userService, times(1)).selectTailor(1L, 2L);
        verify(dtoMappingService, never()).toUserDTO(any());
    }
}