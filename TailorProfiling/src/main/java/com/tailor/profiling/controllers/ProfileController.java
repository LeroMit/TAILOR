package com.tailor.profiling.controllers;

import com.tailor.profiling.models.GraphNode;
import com.tailor.profiling.models.Profile;
import com.tailor.profiling.models.UserFlick;
import com.tailor.profiling.requests.PonderationRequest;
import com.tailor.profiling.requests.UpdateProfileRequest;
import com.tailor.profiling.requests.UserFlickRequest;
import com.tailor.profiling.services.ConvertService;
import com.tailor.profiling.services.ProfileService;
import com.tailor.profiling.services.ScoreService;
import com.tailor.profiling.services.SerializationService;
import com.tailor.profiling.requests.ProfileRequest;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@Slf4j
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @Autowired
    private SerializationService serializationService;

    @Autowired
    private ConvertService convertService;

    @Autowired
    private ScoreService scoreService;

    @GetMapping("/profile/json/{tailorId}")
    public ResponseEntity<String> getProfile(@PathVariable(value = "tailorId") Long tailorId) {
        try {
            Optional<Profile> profile = profileService.getProfile(tailorId);
            if (profile.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            List<GraphNode> graphNodes = serializationService.generateGraphRepresentation(profile.get());
            graphNodes = convertService.replaceTagIdsByLabels(graphNodes);
            return ResponseEntity.ok(serializationService.toJson(graphNodes));
        } catch (Exception e) {
            log.error("Error while fetching profile for tailorId: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/profile/ponderations/{tailorId}")
    public ResponseEntity<HashMap<Long, Float>> getProfilePonderations(@PathVariable(value = "tailorId") Long tailorId,
            @RequestBody PonderationRequest ponderationRequest) {
        try {
            Optional<Profile> profile = profileService.getProfile(tailorId);
            if (profile.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            String localisation = convertService.convertLatLngToString(ponderationRequest.getLatitude(),
                    ponderationRequest.getLongitude());
            String watchedAt = convertService.convertDateTimeToTimeWindow(ponderationRequest.getWatchedAt()).toString();
            return ResponseEntity
                    .ok(profileService.getTagsWithScoreFromProfileSummary(profile.get(), localisation, watchedAt));
        } catch (Exception e) {
            log.error("Error while fetching profile for tailorId: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/profile/create")
    public ResponseEntity<Profile> createProfile(
            @RequestBody ProfileRequest profileRequest) {
        List<Long> tagIds = profileRequest.getTagIds();
        Profile profile = profileService.createProfile(profileRequest.getTailorId(), tagIds);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/profile/update/{tailorId}")
    public ResponseEntity<String> updateProfile(
            @RequestBody UpdateProfileRequest updateProfileRequest,
            @PathVariable(value = "tailorId") Long tailorId) {
        Profile profile = profileService.getProfile(tailorId).orElse(null);
        log.info("Getting tailorId: " + tailorId);
        if (profile == null) {
            return ResponseEntity.badRequest().build();
        }
        log.info("Updating profile for tailorId: " + tailorId);
        List<UserFlickRequest> userFlickRequestToAdd = updateProfileRequest.getUserFlickRequestToAdd();
        List<UserFlickRequest> userFlickRequestToRemove = updateProfileRequest.getUserFlickRequestToRemove();

        List<UserFlick> userFlickToAdd = scoreService.calculateScore(userFlickRequestToAdd);
        List<UserFlick> userFlickToRemove = scoreService.calculateScore(userFlickRequestToRemove);

        profile = profileService.updateProfile(profile, userFlickToAdd, userFlickToRemove);
        profileService.generateProfileSummary(profile);
        return ResponseEntity.ok("OK");
    }
}
