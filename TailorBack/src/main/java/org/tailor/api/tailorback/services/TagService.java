package org.tailor.api.tailorback.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tailor.api.tailorback.dtos.tag.TagDTO;
import org.tailor.api.tailorback.dtos.tag.TagsSummaryDTO;
import org.tailor.api.tailorback.models.Flick;
import org.tailor.api.tailorback.models.Tag;
import org.tailor.api.tailorback.repositories.FlicksRepository;
import org.tailor.api.tailorback.repositories.TagsRepository;
import org.tailor.api.tailorback.requests.TagRequest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TagService {
    private final TagsRepository tagsRepository;
    private final FlicksRepository flicksRepository;

    @Autowired
    DTOMappingService dtoMappingService;

    public Tag createTag(TagRequest tag) {
        log.debug("Creating tag");
        Tag tagToCreate = Tag.builder()
                .label(tag.getLabel())
                .build();

        Optional<Tag> existingTag = tagsRepository.findByLabel(tag.getLabel());
        if (existingTag.isPresent()) {
            log.info("Tag already exists");
            return existingTag.get();
        }
        Tag createdTag = tagsRepository.save(tagToCreate);
        log.debug("Tag " + createdTag.getId() + " created");
        return createdTag;
    }

    public Optional<Tag> getTag(Long id) {
        log.debug("Getting tag with id " + id);
        Optional<Tag> tag = tagsRepository.findById(id);
        if (tag.isEmpty()) {
            log.info("Tag not found in getTag");
            return Optional.empty();
        }
        return tag;
    }

    public Optional<List<Tag>> getTags(List<Long> id) {
        log.debug("Getting tags with ids " + id);
        List<Tag> tags = tagsRepository.findAllById(id);
        if (tags.isEmpty()) {
            log.info("Tags not found in getTags");
            return Optional.empty();
        }
        return Optional.ofNullable(tags);
    }

    public List<Tag> getTags() {
        log.debug("Getting tags");
        return tagsRepository.findAll();
    }

    public Optional<List<Tag>> getTagsFromFlick(Long videoId) {
        log.debug("Getting tags from video id ", videoId);
        Flick flick = flicksRepository.findById(videoId).orElse(null);
        if (flick == null) {
            log.info("Flick not found in getTagsFromFlick");
            return Optional.empty();
        }
        List<Tag> tags = flick.getTags();
        if (tags == null) {
            log.info("Tags not found in getTagsFromFlick");
            return Optional.empty();
        }

        return Optional.ofNullable(tags);
    }

    public List<TagDTO> listTagToListTagDTO(List<Tag> tags) {
        return tags.stream().map(tag -> dtoMappingService.toTagDTO(tag)).collect(Collectors.toList());
    }

    public TagsSummaryDTO listTagToTagsSummaryDTO(List<Tag> tags) {
        return dtoMappingService.toTagSummaryDTO(tags);
    }
}
