package org.tailor.api.tailorback.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tailor.api.tailorback.dtos.tag.TagsSummaryDTO;
import org.tailor.api.tailorback.models.Tag;
import org.tailor.api.tailorback.requests.TagRequest;
import org.tailor.api.tailorback.services.TagService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Collections;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Slf4j
public class TagsController {
    @Autowired
    TagService tagService;

    @GetMapping("/tags")
    public ResponseEntity<List<Tag>> getTags() {
        List<Tag> tags = tagService.getTags();
        if (tags.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tags);
    }

    @PostMapping("/getTags")
    public ResponseEntity<TagsSummaryDTO> getTagsByIds(@RequestBody List<Long> tagIds) {
        log.error("tagIds: " + tagIds);
        Optional<List<Tag>> tags = tagService.getTags(tagIds);
        if (tags.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(tagService.listTagToTagsSummaryDTO(tags.get()));
    }

    @GetMapping("/hotTags")
    public ResponseEntity<List<Tag>> getHotTags() {
        List<Tag> tags = tagService.getTags();
        if (tags.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        Collections.shuffle(tags);
        List<Tag> limitedTags = tags.stream().limit(50).collect(Collectors.toList());
        return ResponseEntity.ok(limitedTags);
    }

    @PostMapping("/tags/create")
    public ResponseEntity<Long> createTag(@Valid @RequestBody TagRequest tagRequest) {

        Long tagId = tagService.createTag(tagRequest).getId();

        return ResponseEntity.ok(tagId);
    }
}