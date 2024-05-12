package org.tailor.api.tailorback.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.tailor.api.tailorback.dtos.TailorDTO;
import org.tailor.api.tailorback.models.Tailor;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.TailorsRepository;
import org.tailor.api.tailorback.repositories.UserRepository;
import org.tailor.api.tailorback.requests.ProfileRequest;
import org.tailor.api.tailorback.requests.TailorRequest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TailorService {
    @Value("${tailor_profiling_url}")
    private String tailorProfilingUrl;

    private final TailorsRepository tailorRepository;
    private final RestTemplate restTemplate;
    private final UserRepository userRepository;

    @Autowired
    private DTOMappingService dtoMappingService;

    public List<TailorDTO> listTailorToListTailorDTO(List<Tailor> tailors) {
        return tailors.stream().map(tailor -> dtoMappingService.toTailorDTO(tailor)).collect(Collectors.toList());
    }

    public List<Tailor> findAll() {
        log.debug("Getting all tailors");
        return tailorRepository.findAll();
    }

    public Optional<Tailor> createTailor(TailorRequest tailorRequest, Long userId) {
        log.debug("Creating tailor for user " + userId + " with title " + tailorRequest.getTitle());
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.info("User not found in createTailor");
            return Optional.empty();
        }

        Tailor tailor = Tailor.builder()
                .title(tailorRequest.getTitle())
                .isLocked(tailorRequest.getIsLocked())
                .isPublic(tailorRequest.getIsPublic())
                .isFavourite(tailorRequest.getIsFavourite())
                .createdBy(user)
                .build();
        Tailor created_tailor = tailorRepository.save(tailor);

        ResponseEntity<Object> response = createProfile(created_tailor.getId(), user);
        if (response.getStatusCode().isError()) {
            log.error("Error while creating profile for tailor " + created_tailor.getId());
            tailorRepository.deleteById(created_tailor.getId());
            return Optional.empty();
        }
        return Optional.of(created_tailor);
    }

    private ResponseEntity<Object> createProfile(Long tailorId, User user) {
        log.debug("Creating profile for tailor " + tailorId);
        ProfileRequest request = new ProfileRequest();
        request.setTailorId(tailorId);
        request.setTagIds(user.getDefaultTags().stream().map(tag -> tag.getId()).collect(Collectors.toList()));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Object> response = restTemplate.postForEntity(tailorProfilingUrl + "/api/profile/create",
                request,
                Object.class);

        return response;
    }

    public Optional<Tailor> getTailor(Long id) {
        log.debug("Getting tailor with id " + id);
        Optional<Tailor> tailor = tailorRepository.findById(id);
        if (tailor.isEmpty()) {
            log.info("Tailor not found in getTailor");
            return Optional.empty();
        }
        return tailor;
    }

    public String getTailorJson(Long id) {
        log.debug("Getting tailor json representation with id " + id + " as json");
        String url = String.format("%s/api/profile/json/%d", tailorProfilingUrl, id);
        return restTemplate.getForObject(url, String.class);
    }

    public Optional<List<Tailor>> getTailorsByUser(Long userId) {
        log.debug("Getting user " + userId + " tailors");
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.info("User not found in getTailorsByUser");
            return Optional.empty();
        }
        return Optional.ofNullable(tailorRepository.findByCreatedBy(user));
    }
}
