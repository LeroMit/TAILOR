package org.tailor.api.tailorback.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.tailor.api.tailorback.models.*;
import org.tailor.api.tailorback.repositories.*;
import org.tailor.api.tailorback.requests.*;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserFlickService {
    private final UserFlicksRepository userFlicksRepository;
    private final TailorsRepository tailorsRepository;

    private final RestTemplate restTemplate;

    @Value("${tailor_profiling_url}")
    private String tailorProfilingUrl;

    public UserFlick createUserFlick(Flick flick, User user, UserFlickRequest userFlickRequest) {
        ZonedDateTime zonedDateTime = ZonedDateTime.parse(userFlickRequest.getWatchedAt());
        UserFlick userFlick = UserFlick.builder()
                .id(new UserFlickKey(user.getId(), flick.getId()))
                .user(user)
                .flick(flick)
                .watchedDuring(0.5F)
                .watchedAt(zonedDateTime)
                .latitude(userFlickRequest.getLatitude())
                .longitude(userFlickRequest.getLongitude())
                .isYay(userFlickRequest.getIsYay())
                .isNay(userFlickRequest.getIsNay())
                .isLiked(userFlickRequest.getIsLiked())
                .isShared(userFlickRequest.getIsShared())
                .build();

        log.info("Creating user flick for user " + user.getId() + " and flick " + flick.getId());

        Optional<Tailor> tailor = tailorsRepository.findById(user.getSelectedTailorId());
        if (tailor.isPresent()) {
            Tailor t = tailor.get();
            if (t.getCounterUserFlicks() == 10) {
                Pageable pageableAdd = PageRequest.of(0, 10, Sort.by("watchedAt"));
                Page<UserFlick> userFlicksToAdd = userFlicksRepository.findUserFlicksByUserIdLimit(user.getId(),
                        pageableAdd);
                List<UserFlickRequest> userFlicksToRemoveRequest = new ArrayList<>();
                if (userFlicksRepository.countByUserId(user.getId()) > 500) {
                    Page<UserFlick> userFlicksToRemove;
                    Pageable pageable = PageRequest.of(49, 10, Sort.by("watchedAt"));
                    userFlicksToRemove = userFlicksRepository
                            .findByUserIdOrderedByWatchedAt(user.getId(), pageable);
                    for (UserFlick uf : userFlicksToRemove) {
                        userFlicksToRemoveRequest.add(UserFlickRequest.builder()
                                .idFlick(uf.getFlick().getId())
                                .isLiked(uf.getIsLiked())
                                .isNay(uf.getIsNay())
                                .isShared(uf.getIsShared())
                                .isYay(uf.getIsYay())
                                .latitude(uf.getLatitude())
                                .longitude(uf.getLongitude())
                                .watchedDuring(uf.getWatchedDuring())
                                .watchedAt(uf.getWatchedAt().toString())
                                .build());
                    }
                }
                List<UserFlickRequest> userFlicksToAddRequest = new ArrayList<>();

                for (UserFlick uf : userFlicksToAdd) {
                    userFlicksToAddRequest.add(UserFlickRequest.builder()
                            .idFlick(uf.getFlick().getId())
                            .isLiked(uf.getIsLiked())
                            .isNay(uf.getIsNay())
                            .isShared(uf.getIsShared())
                            .isYay(uf.getIsYay())
                            .latitude(uf.getLatitude())
                            .longitude(uf.getLongitude())
                            .watchedDuring(uf.getWatchedDuring())
                            .watchedAt(uf.getWatchedAt().toString())
                            .build());
                }

                UpdateProfileRequest updateProfileRequest = UpdateProfileRequest.builder()
                        .userFlickRequestToAdd(userFlicksToAddRequest)
                        .userFlickRequestToRemove(userFlicksToRemoveRequest)
                        .build();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<UpdateProfileRequest> request = new HttpEntity<>(updateProfileRequest, headers);

                final String url = String.format("%s/api/profile/update/%s",
                        tailorProfilingUrl, t.getId());

                ResponseEntity<String> response = restTemplate.postForEntity(url,
                        request,
                        String.class);
                t.setCounterUserFlicks(0);
            } else {
                t.setCounterUserFlicks(t.getCounterUserFlicks() + 1);
            }
            t = tailorsRepository.save(t);
        }
        return userFlicksRepository.save(userFlick);
    }

    public TagPonderationRequest getTagPonderation(Long tailorId, FeedParamsRequest feedParams) {
        final String url = String.format("%s/api/profile/ponderations/%d", tailorProfilingUrl, tailorId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        PonderationRequest ponderationRequest = new PonderationRequest();
        ponderationRequest.setLatitude(feedParams.getLatitude());
        ponderationRequest.setLongitude(feedParams.getLongitude());
        ponderationRequest.setWatchedAt(feedParams.getWatchedAt());

        HttpEntity<PonderationRequest> request = new HttpEntity<>(ponderationRequest, headers);
        ResponseEntity<TagPonderationRequest> data = restTemplate.postForEntity(url, request,
                TagPonderationRequest.class);
        TagPonderationRequest tagPonderationRequest = data.getBody();
        if (tagPonderationRequest == null || tagPonderationRequest.getTagPonderationMap() == null) {
            tagPonderationRequest = new TagPonderationRequest();
            tagPonderationRequest.setTagPonderationMap(new HashMap<>());
        }
        return tagPonderationRequest;
    }

    public List<UserFlick> getUserFlickByUser(Long userId) {
        log.info("Getting user flicks for user " + userId);
        return userFlicksRepository.findUserFlicksByUserId(userId);
    }
}
