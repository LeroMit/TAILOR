package org.tailor.api.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tailor.api.tailorback.models.Flick;
import org.tailor.api.tailorback.models.Tag;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.FlicksRepository;
import org.tailor.api.tailorback.repositories.TagsRepository;
import org.tailor.api.tailorback.requests.FlickRequest;
import org.tailor.api.tailorback.services.DTOMappingService;
import org.tailor.api.tailorback.services.FlickService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlickServiceTest {

    @Mock
    private FlicksRepository flicksRepository;

    @Mock
    private TagsRepository tagsRepository;

    @InjectMocks
    private FlickService flickService;

    private Flick flick;
    private Tag tag;
    private FlickRequest flickRequest;

    @BeforeEach
    void setUp() {
        tag = Tag.builder().id(1L).label("Test Tag").build();
        flick = Flick.builder().id(1L).title("Test Flick").tags(Arrays.asList(tag)).build();
        flickRequest = FlickRequest.builder().title("Test Flick").description("Test Description").url("https://example.com").tagsIds(Arrays.asList(1L)).build();
    }

    @Test
    void createFlick_shouldReturnCreatedFlick() {
        List<Tag> tags = Arrays.asList(tag);
        when(tagsRepository.findAllById(flickRequest.getTagsIds())).thenReturn(tags);
        when(flicksRepository.save(any(Flick.class))).thenReturn(flick);

        Flick createdFlick = flickService.createFlick(flickRequest, User.builder().id(1L).build());

        assertNotNull(createdFlick);
        assertEquals(flick.getId(), createdFlick.getId());
        assertEquals(flick.getTitle(), createdFlick.getTitle());
        assertEquals(tags, createdFlick.getTags());
        verify(tagsRepository, times(1)).findAllById(flickRequest.getTagsIds());
        verify(flicksRepository, times(1)).save(any(Flick.class));
    }

    @Test
    void getFlick_shouldReturnFlickWhenFound() {
        when(flicksRepository.findById(1L)).thenReturn(Optional.of(flick));

        Optional<Flick> retrievedFlick = flickService.getFlick(1L);

        assertTrue(retrievedFlick.isPresent());
        assertEquals(flick.getId(), retrievedFlick.get().getId());
        verify(flicksRepository, times(1)).findById(1L);
    }

    @Test
    void getFlick_shouldReturnEmptyOptionalWhenFlickNotFound() {
        when(flicksRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Flick> retrievedFlick = flickService.getFlick(1L);

        assertFalse(retrievedFlick.isPresent());
        verify(flicksRepository, times(1)).findById(1L);
    }

    @Test
    void getFlicksFromTag_shouldReturnListOfFlicksWhenTagFound() {
        List<Flick> flickList = Arrays.asList(flick);
        when(tagsRepository.findById(1L)).thenReturn(Optional.of(tag));
        when(flicksRepository.findByTags_Id(1L)).thenReturn(flickList);

        Optional<List<Flick>> retrievedFlicks = flickService.getFlicksFromTag(1L);

        assertTrue(retrievedFlicks.isPresent());
        assertEquals(1, retrievedFlicks.get().size());
        assertEquals(flick.getId(), retrievedFlicks.get().get(0).getId());
        verify(tagsRepository, times(1)).findById(1L);
        verify(flicksRepository, times(1)).findByTags_Id(1L);
    }

    @Test
    void getFlicksFromTag_shouldReturnEmptyOptionalWhenTagNotFound() {
        when(tagsRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<List<Flick>> retrievedFlicks = flickService.getFlicksFromTag(1L);

        assertFalse(retrievedFlicks.isPresent());
        verify(tagsRepository, times(1)).findById(1L);
        verify(flicksRepository, never()).findByTags_Id(anyLong());
    }
}