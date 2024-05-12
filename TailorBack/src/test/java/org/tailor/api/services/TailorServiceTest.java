package org.tailor.api.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tailor.api.tailorback.models.Tailor;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.TailorsRepository;
import org.tailor.api.tailorback.repositories.UserRepository;
import org.tailor.api.tailorback.requests.TailorRequest;
import org.tailor.api.tailorback.services.DTOMappingService;
import org.tailor.api.tailorback.services.TailorService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TailorServiceTest {

    @Mock
    private TailorsRepository tailorRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DTOMappingService dtoMappingService;

    @InjectMocks
    private TailorService tailorService;

    private Tailor tailor;
    private User user;
    private TailorRequest tailorRequest;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).build();
        tailor = Tailor.builder().id(1L).title("Test Tailor").createdBy(user).build();
        tailorRequest = new TailorRequest("Test Tailor", false, false, false);
    }

    @Test
    void getTailor_shouldReturnTailorWhenFound() {
        when(tailorRepository.findById(1L)).thenReturn(Optional.of(tailor));

        Optional<Tailor> retrievedTailor = tailorService.getTailor(1L);

        assertTrue(retrievedTailor.isPresent());
        assertEquals(tailor.getId(), retrievedTailor.get().getId());
        verify(tailorRepository, times(1)).findById(1L);
    }

    @Test
    void getTailor_shouldReturnEmptyOptionalWhenTailorNotFound() {
        when(tailorRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Tailor> retrievedTailor = tailorService.getTailor(1L);

        assertFalse(retrievedTailor.isPresent());
        verify(tailorRepository, times(1)).findById(1L);
    }

    @Test
    void getTailorsByUser_shouldReturnListOfTailorsWhenUserFound() {
        List<Tailor> tailorList = Arrays.asList(tailor);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(tailorRepository.findByCreatedBy(user)).thenReturn(tailorList);

        Optional<List<Tailor>> retrievedTailors = tailorService.getTailorsByUser(1L);

        assertTrue(retrievedTailors.isPresent());
        assertEquals(1, retrievedTailors.get().size());
        assertEquals(tailor.getId(), retrievedTailors.get().get(0).getId());
        verify(userRepository, times(1)).findById(1L);
        verify(tailorRepository, times(1)).findByCreatedBy(user);
    }

    @Test
    void getTailorsByUser_shouldReturnEmptyOptionalWhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<List<Tailor>> retrievedTailors = tailorService.getTailorsByUser(1L);

        assertFalse(retrievedTailors.isPresent());
        verify(userRepository, times(1)).findById(1L);
        verify(tailorRepository, never()).findByCreatedBy(any(User.class));
    }

    @Test
    void createTailor_shouldReturnCreatedTailorWhenUserFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(tailorRepository.save(any(Tailor.class))).thenReturn(tailor);

        Optional<Tailor> createdTailor = tailorService.createTailor(tailorRequest, 1L);

        assertTrue(createdTailor.isPresent());
        assertEquals(tailor.getId(), createdTailor.get().getId());
        verify(userRepository, times(1)).findById(1L);
        verify(tailorRepository, times(1)).save(any(Tailor.class));
    }

    @Test
    void createTailor_shouldReturnEmptyOptionalWhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Tailor> createdTailor = tailorService.createTailor(tailorRequest, 1L);

        assertFalse(createdTailor.isPresent());
        verify(userRepository, times(1)).findById(1L);
        verify(tailorRepository, never()).save(any(Tailor.class));
    }
}