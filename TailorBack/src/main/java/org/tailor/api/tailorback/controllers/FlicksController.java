package org.tailor.api.tailorback.controllers;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.tailor.api.tailorback.dtos.FlickDTO;
import org.tailor.api.tailorback.dtos.flick.FlickShareDTO;
import org.tailor.api.tailorback.models.Flick;
import org.tailor.api.tailorback.models.FlickShare;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.requests.FlickRequest;
import org.tailor.api.tailorback.services.DTOMappingService;
import org.tailor.api.tailorback.services.FlickService;
import org.tailor.api.tailorback.services.TagService;
import org.tailor.api.tailorback.services.UserService;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Slf4j
public class FlicksController {
    @Autowired
    FlickService flickService;

    @Autowired
    TagService tagService;

    @Autowired
    UserService userService;

    @Autowired
    private DTOMappingService dtoMappingService;

    @PostMapping(value = "/flick")
    public ResponseEntity<FlickDTO> createFlick(@Valid @RequestBody FlickRequest flickRequest) {
        Optional<User> user = userService.getUser(flickRequest.getCreatorId());
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (flickRequest.getTagsToCreate() != null) {
            flickRequest.getTagsToCreate().forEach((tag -> {
                List<Long> newTagIds = flickRequest.getTagsIds();
                newTagIds.add(tagService.createTag(tag).getId());
                flickRequest.setTagsIds(newTagIds);
            }));
        }

        Flick newFlick = flickService.createFlick(flickRequest, user.get());
        return ResponseEntity.ok(flickService.flickToFlickDTO(newFlick));
    }

    @GetMapping("flick/{flickId}/share/{senderId}/{receiverId}")
    public ResponseEntity<FlickShareDTO> shareFlick(@PathVariable Long flickId, @PathVariable Long senderId,
            @PathVariable Long receiverId) {
        Optional<Flick> flick = flickService.getFlick(flickId);
        Optional<User> sender = userService.getUser(senderId);
        Optional<User> receiver = userService.getUser(receiverId);

        if (flick.isEmpty() || sender.isEmpty() || receiver.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        FlickShare createdFlickShare = flickService.shareFlick(flick.get(), sender.get(), receiver.get());

        return ResponseEntity.ok(dtoMappingService.toFlickShareDTO(createdFlickShare));
    }
}