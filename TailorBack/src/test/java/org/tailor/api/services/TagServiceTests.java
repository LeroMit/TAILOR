package org.tailor.api.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.tailor.api.tailorback.models.Flick;
import org.tailor.api.tailorback.models.Tag;
import org.tailor.api.tailorback.repositories.FlicksRepository;
import org.tailor.api.tailorback.repositories.TagsRepository;
import org.tailor.api.tailorback.requests.TagRequest;
import org.tailor.api.tailorback.services.DTOMappingService;
import org.tailor.api.tailorback.services.TagService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TagServiceTest {

    @Mock
    private TagsRepository tagsRepository;

    @Mock
    private FlicksRepository flicksRepository;

    @Mock
    private DTOMappingService dtoMappingService;

    @InjectMocks
    private TagService tagService;

    private Tag tag;
    private TagRequest tagRequest;
    private Flick flick;

    @BeforeEach
    void setUp() {
        tag = Tag.builder().id(1L).label("Test Tag").build();
        tagRequest = new TagRequest("Test Tag");
        flick = Flick.builder().id(1L).tags(Arrays.asList(tag)).build();
    }

    @Test
    void createTag_shouldReturnCreatedTag() {
        when(tagsRepository.save(any(Tag.class))).thenReturn(tag);

        Tag createdTag = tagService.createTag(tagRequest);

        assertNotNull(createdTag);
        assertEquals(tag.getId(), createdTag.getId());
        assertEquals(tag.getLabel(), createdTag.getLabel());
        verify(tagsRepository, times(1)).save(any(Tag.class));
    }

    @Test
    void getTag_shouldReturnTagWhenFound() {
        when(tagsRepository.findById(1L)).thenReturn(Optional.of(tag));

        Optional<Tag> retrievedTag = tagService.getTag(1L);

        assertTrue(retrievedTag.isPresent());
        assertEquals(tag.getId(), retrievedTag.get().getId());
        verify(tagsRepository, times(1)).findById(1L);
    }

    @Test
    void getTag_shouldReturnEmptyOptionalWhenTagNotFound() {
        when(tagsRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Tag> retrievedTag = tagService.getTag(1L);

        assertFalse(retrievedTag.isPresent());
        verify(tagsRepository, times(1)).findById(1L);
    }

    @Test
    void getTags_shouldReturnListOfTagsWhenFound() {
        List<Long> tagIds = Arrays.asList(1L);
        when(tagsRepository.findAllById(tagIds)).thenReturn(Arrays.asList(tag));

        Optional<List<Tag>> retrievedTags = tagService.getTags(tagIds);

        assertTrue(retrievedTags.isPresent());
        assertEquals(1, retrievedTags.get().size());
        assertEquals(tag.getId(), retrievedTags.get().get(0).getId());
        verify(tagsRepository, times(1)).findAllById(tagIds);
    }

    @Test
    void getTags_shouldReturnEmptyOptionalWhenTagsNotFound() {
        List<Long> tagIds = Arrays.asList(1L);
        when(tagsRepository.findAllById(tagIds)).thenReturn(Arrays.asList());

        Optional<List<Tag>> retrievedTags = tagService.getTags(tagIds);

        assertFalse(retrievedTags.isPresent());
        verify(tagsRepository, times(1)).findAllById(tagIds);
    }

    @Test
    void getTags_shouldReturnListOfAllTags() {
        when(tagsRepository.findAll()).thenReturn(Arrays.asList(tag));

        List<Tag> retrievedTags = tagService.getTags();

        assertNotNull(retrievedTags);
        assertEquals(1, retrievedTags.size());
        assertEquals(tag.getId(), retrievedTags.get(0).getId());
        verify(tagsRepository, times(1)).findAll();
    }

    @Test
    void getTagsFromFlick_shouldReturnListOfTagsWhenFlickFound() {
        when(flicksRepository.findById(1L)).thenReturn(Optional.of(flick));

        Optional<List<Tag>> retrievedTags = tagService.getTagsFromFlick(1L);

        assertTrue(retrievedTags.isPresent());
        assertEquals(1, retrievedTags.get().size());
        assertEquals(tag.getId(), retrievedTags.get().get(0).getId());
        verify(flicksRepository, times(1)).findById(1L);
    }

    @Test
    void getTagsFromFlick_shouldReturnEmptyOptionalWhenFlickNotFound() {
        when(flicksRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<List<Tag>> retrievedTags = tagService.getTagsFromFlick(1L);

        assertFalse(retrievedTags.isPresent());
        verify(flicksRepository, times(1)).findById(1L);
    }

    @Test
    void getTagsFromFlick_shouldReturnEmptyOptionalWhenTagsNotFound() {
        Flick flickWithoutTags = Flick.builder().id(1L).build();
        when(flicksRepository.findById(1L)).thenReturn(Optional.of(flickWithoutTags));

        Optional<List<Tag>> retrievedTags = tagService.getTagsFromFlick(1L);

        assertFalse(retrievedTags.isPresent());
        verify(flicksRepository, times(1)).findById(1L);
    }
}