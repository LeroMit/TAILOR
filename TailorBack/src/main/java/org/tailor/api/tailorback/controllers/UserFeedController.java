package org.tailor.api.tailorback.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tailor.api.tailorback.dtos.FlickDTO;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.requests.*;
import org.tailor.api.tailorback.services.FlickService;
import org.tailor.api.tailorback.services.UserFlickService;
import org.tailor.api.tailorback.services.UserService;

import java.util.HashMap;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Slf4j
public class UserFeedController {
    @Autowired
    FlickService flickService;

    @Autowired
    UserService userService;

    @Autowired
    UserFlickService userFlickService;

    @PostMapping("/user/{userId}/feed")
    public ResponseEntity<List<FlickDTO>> getUserFeed(@PathVariable(value = "userId") Long userId,
            @RequestBody FeedParamsRequest feedParams) {
        User user = userService.getUser(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        Long tailorId = user.getSelectedTailorId();
        if (tailorId == null) {
            return ResponseEntity.badRequest().build();
        }
        TagPonderationRequest tagPonderationRequest = userFlickService.getTagPonderation(tailorId,feedParams);

        List<FlickDTO> flickDTOs = flickService.sendNextFlicksDTO(tagPonderationRequest, user,
                feedParams.getNbVideos());
        return ResponseEntity.ok(flickDTOs);
    }
}
