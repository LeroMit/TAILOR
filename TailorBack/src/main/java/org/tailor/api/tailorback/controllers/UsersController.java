package org.tailor.api.tailorback.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tailor.api.tailorback.dtos.user.UserDTO;
import org.tailor.api.tailorback.models.Tag;
import org.tailor.api.tailorback.models.Tailor;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.requests.UserRequest;
import org.tailor.api.tailorback.requests.TailorRequest;
import org.tailor.api.tailorback.services.DTOMappingService;
import org.tailor.api.tailorback.services.TagService;
import org.tailor.api.tailorback.services.TailorService;
import org.tailor.api.tailorback.services.UserService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Slf4j
public class UsersController {
    @Autowired
    DTOMappingService dtoMappingService;

    @Autowired
    UserService userService;

    @Autowired
    TailorService tailorService;

    @Autowired
    TagService tagService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<User> users = userService.getUsers();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<UserDTO> userDTOS = dtoMappingService.listUserToListUserDTO(users);
        return ResponseEntity.ok(userDTOS);
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable(value = "userId") Long userId) {
        User user = userService.getUser(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(dtoMappingService.toUserDTO(user));
    }

    @PostMapping("/user")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserRequest user) {
        List<Tag> tags = tagService.getTags(user.getDefaultTagsIds()).orElse(null);
        if (tags == null) {
            return ResponseEntity.badRequest().build();
        }
        User createdUser = userService.createUser(user, tags);
        TailorRequest tailorRequest = TailorRequest.builder()
                .title("Default tailor")
                .isLocked(false)
                .isPublic(false)
                .isFavourite(false)
                .build();
        Optional<Tailor> tailor = tailorService.createTailor(tailorRequest, createdUser.getId());
        if (tailor.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        createdUser = userService.updateUserSelectedTailor(createdUser.getId(), tailor.get().getId());

        return ResponseEntity.ok(dtoMappingService.toUserDTO(createdUser));
    }

    @PutMapping("/user/{userId}/selectedTailor/{tailorId}")
    public ResponseEntity<UserDTO> selectTailor(@PathVariable(value = "userId") Long userId,
            @PathVariable(value = "tailorId") Long tailorId) {
        User updatedUser = userService.selectTailor(userId, tailorId).orElse(null);
        if (updatedUser == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(dtoMappingService.toUserDTO(updatedUser));
    }
}
