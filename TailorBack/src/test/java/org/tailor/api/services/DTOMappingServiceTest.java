package org.tailor.api.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tailor.api.tailorback.dtos.TailorDTO;
import org.tailor.api.tailorback.dtos.user.UserDTO;
import org.tailor.api.tailorback.dtos.user.UserSummaryDTO;
import org.tailor.api.tailorback.models.Tailor;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.UserRepository;
import org.tailor.api.tailorback.services.DTOMappingService;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DTOMappingServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DTOMappingService dtomappingService;

    @BeforeEach
    public void setup() {
        // Initialize any necessary state or mocks before each test
    }

    @Test
    public void testToUserSummaryDTO() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setBio("Test Bio");
        user.setPhotoUrl("Test Photo URL");

        // Act
        UserSummaryDTO userSummaryDTO = dtomappingService.toUserSummaryDTO(user);

        // Assert
        assertEquals(1L, userSummaryDTO.getId());
        assertEquals("Test Bio", userSummaryDTO.getBio());
        assertEquals("Test Photo URL", userSummaryDTO.getPhotoUrl());
    }

    @Test
    public void testToUserDTO() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setBio("Test Bio");
        user.setPhotoUrl("Test Photo URL");
        user.setSelectedTailorId(1L);
        user.setCreatedOn(Instant.parse("2022-01-01T00:00:00.000Z"));
        user.setUpdatedOn(Instant.parse("2022-01-01T00:00:00.000Z"));

        // Act
        UserDTO userDTO = dtomappingService.toUserDTO(user);

        // Assert
        assertEquals(1L, userDTO.getId());
        assertEquals("Test Bio", userDTO.getBio());
        assertEquals("Test Photo URL", userDTO.getPhotoUrl());
        assertEquals(1L, userDTO.getSelectedTailorId());
        assertEquals(Instant.parse("2022-01-01T00:00:00.000Z"), userDTO.getCreatedOn());
        assertEquals(Instant.parse("2022-01-01T00:00:00.000Z"), userDTO.getUpdatedOn());
    }

    @Test
    public void testToTailorDTO() {
        // Arrange
        Tailor tailor = new Tailor();
        tailor.setId(1L);
        tailor.setTitle("Test Title");
        tailor.setIsLocked(true);
        tailor.setIsPublic(true);
        tailor.setIsFavourite(true);

        // Act
        TailorDTO tailorDTO = dtomappingService.toTailorDTO(tailor);

        // Assert
        assertEquals(1L, tailorDTO.getId());
        assertEquals("Test Title", tailorDTO.getTitle());
        assertEquals(true, tailorDTO.getIsLocked());
        assertEquals(true, tailorDTO.getIsPublic());
        assertEquals(true, tailorDTO.getIsFavourite());
    }
}
