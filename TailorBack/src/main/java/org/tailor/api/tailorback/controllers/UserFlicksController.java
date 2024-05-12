package org.tailor.api.tailorback.controllers;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tailor.api.tailorback.models.Flick;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.requests.UserFlickRequest;
import org.tailor.api.tailorback.services.FlickService;
import org.tailor.api.tailorback.services.UserFlickService;
import org.tailor.api.tailorback.services.UserService;

import java.util.Optional;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Slf4j
public class UserFlicksController {
    @Autowired
    FlickService flickService;

    @Autowired
    UserFlickService userFlickService;

    @Autowired
    UserService userService;

    /**
     * Create a user flick. The * watchedAt in {@link UserFlickRequest} needs to be formatted like (e.g. ""2011-12-03T10:15:30+01:00"")
     * @param userFlickRequest
     * @param userId
     * @param flickId
     * @return
     */
    @PostMapping("/user/{userId}/flick/{flickId}")
    public ResponseEntity<Boolean> createUserFlick(@Valid @RequestBody UserFlickRequest userFlickRequest,
                                                   @PathVariable(value = "userId") Long userId,
                                                   @PathVariable(value = "flickId") Long flickId) {
        Optional<User> user = userService.getUser(userId);
        Optional<Flick> flick = flickService.getFlick(flickId);
        if (user.isEmpty() || flick.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        userFlickService.createUserFlick(flick.get(), user.get(), userFlickRequest);
        return ResponseEntity.ok(Boolean.TRUE);
    }
}