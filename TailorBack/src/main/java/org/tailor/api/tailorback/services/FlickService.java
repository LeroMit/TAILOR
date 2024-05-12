package org.tailor.api.tailorback.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.tailor.api.tailorback.dtos.FlickDTO;
import org.tailor.api.tailorback.models.Flick;
import org.tailor.api.tailorback.models.FlickShare;
import org.tailor.api.tailorback.models.Tag;
import org.tailor.api.tailorback.models.User;
import org.tailor.api.tailorback.repositories.FlickShareRepository;
import org.tailor.api.tailorback.repositories.FlicksRepository;
import org.tailor.api.tailorback.repositories.TagsRepository;
import org.tailor.api.tailorback.repositories.UserFlicksRepository;
import org.tailor.api.tailorback.requests.FlickRequest;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.tailor.api.tailorback.requests.TagPonderationRequest;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlickService {
    private final RestTemplate restTemplate;
    @Value("${bucket_api_url}")
    private String bucketApiUrl;
    @Value("${bucket_api_file_upload}")
    private String bucketApiFileUpload;

    private final FlicksRepository flicksRepository;
    private final TagsRepository tagsRepository;
    private final FlickShareRepository flickShareRepository;
    private final UserFlicksRepository userFlicksRepository;

    @Autowired
    private DTOMappingService dtoMappingService;
    @Autowired
    private EmbeddedWebServerFactoryCustomizerAutoConfiguration embeddedWebServerFactoryCustomizerAutoConfiguration;

    public String uploadVideoToBucket(MultipartFile file) {
        log.debug("Uploading video to bucket");
        String url = bucketApiUrl + bucketApiFileUpload;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        return restTemplate.postForObject(url, requestEntity, String.class);
    }

    public List<FlickDTO> listFlickToListFlickDTO(List<Flick> flicks) {
        return flicks.stream().map(flick -> dtoMappingService.toFlickDTO(flick)).collect(Collectors.toList());
    }

    public FlickDTO flickToFlickDTO(Flick flick) {
        return dtoMappingService.toFlickDTO(flick);
    }

    public Flick createFlick(FlickRequest flickRequest, User creator) {
        log.debug("Creating flick created by " + creator.getId());
        List<Tag> tags = tagsRepository.findAllById(flickRequest.getTagsIds());
        Flick flick = Flick.builder()
                .title(flickRequest.getTitle())
                .description(flickRequest.getDescription())
                .url(flickRequest.getUrl())
                .tags(tags)
                .postedBy(creator)
                .build();

        Flick createdFlick = flicksRepository.save(flick);
        log.info("Tailor created");
        return createdFlick;
    }

    public Optional<Flick> getFlick(Long id) {
        log.info("Getting flick with id " + id);
        return flicksRepository.findById(id);
    }

    public Optional<List<Flick>> getFlicksFromTag(Long tagId) {
        log.debug("Getting Flicks from tag id ", tagId);
        Tag tag = tagsRepository.findById(tagId).orElse(null);
        if (tag == null) {
            log.info("Tag not found in getFlicksFromTag");
            return Optional.empty();
        }

        List<Flick> flicks = flicksRepository.findByTags_Id(tagId);
        return Optional.ofNullable(flicks);
    }

    public FlickShare shareFlick(Flick flick, User sender, User receiver) {
        FlickShare flickShare = FlickShare.builder()
                .user(sender)
                .flick(flick)
                .to(receiver)
                .build();

        FlickShare createdFlickShare = flickShareRepository.save(flickShare);
        log.info("Flick shared");
        // TODO notify "to" through websocket
        return createdFlickShare;
    }

    private List<Pair<Long, Double>> normalizeAndSortByDescTagPonderation(List<Pair<Long, Double>> tagPonderation) {
        double sum = tagPonderation.stream().mapToDouble(Pair::getSecond).sum();
        tagPonderation.replaceAll(pair -> Pair.of(pair.getFirst(), pair.getSecond() / sum));
        tagPonderation.sort((p1, p2) -> p2.getSecond().compareTo(p1.getSecond()));
        return tagPonderation;
    }
    private List<Pair<Long, Double>> convertTagPonderation(TagPonderationRequest tagPonderationList) {
        List<Pair<Long, Double>> tagPonderation = new ArrayList<>();
        HashMap<Long, Double> tagPonderationMap = tagPonderationList.getTagPonderationMap();

        double currentSum = tagPonderationMap.values().stream().mapToDouble(Double::doubleValue).sum();
        double ratio = 0.9 / currentSum;
        tagPonderationMap.replaceAll((k, v) -> v * ratio);
        tagPonderationList.getTagPonderationMap().put(0L, 0.1);

        for (Map.Entry<Long, Double> entry : tagPonderationMap.entrySet()) {
            tagPonderation.add(Pair.of(entry.getKey(), entry.getValue()));
        }

        return tagPonderation;
    }

    public List<FlickDTO> sendNextFlicksDTO(TagPonderationRequest tagPonderationList, User user, Long nbVideos) {
        List<Flick> flicks = new ArrayList<>();
        List<Long> foundFlicksIds = new ArrayList<>();
        if (tagPonderationList.getTagPonderationMap().isEmpty()) {
            HashMap<Long,Double> defaultTagPonderation = new HashMap<>();
            defaultTagPonderation.put(0L, 1.0);
            tagPonderationList.setTagPonderationMap(defaultTagPonderation);
        }else {
            HashMap<Long, Double> tagPonderationMap = tagPonderationList.getTagPonderationMap();
            double currentSum = tagPonderationMap.values().stream().mapToDouble(Double::doubleValue).sum();
            double ratio = 0.9 / currentSum;
            tagPonderationMap.replaceAll((k, v) -> v * ratio);
            tagPonderationMap.put(0L, 0.1);
        }

        List<Pair<Long, Double>> tagPonderation = convertTagPonderation(tagPonderationList);

        for (int i = 0; i < nbVideos; i++) {
            int j = 0;
            while(j < 100) {
                tagPonderation = normalizeAndSortByDescTagPonderation(tagPonderation);
                if (tagPonderation.isEmpty()) {
                    Optional<Flick> flick = findSingleFlickWithNoUserFlickForUser(user.getId(), foundFlicksIds);
                    if (flick.isEmpty()) {
                        i = Math.toIntExact(nbVideos);
                        break;
                    } else {
                        flicks.add(flick.get());
                        foundFlicksIds.add(flick.get().getId());
                        break;
                    }
                }
                double randomNumber = Math.random();
                if (randomNumber <= tagPonderation.get(0).getSecond()) {
                    Optional<Flick> flick = Optional.empty();
                    if (tagPonderation.get(0).getFirst() == 0L) {
                        flick = getRandomFlick(user, foundFlicksIds);
                    } else {
                        flick = findSingleFlickWithNoUserFlickForTagAndUser(user.getId(), tagPonderation.get(0).getFirst(), foundFlicksIds);
                    }
                    if (flick.isEmpty()) {
                        tagPonderation.remove(0);
                    } else {
                        flicks.add(flick.get());
                        foundFlicksIds.add(flick.get().getId());
                        break;
                    }
                } else {
                    tagPonderation.remove(0);
                }
                j++;
            }
        }

        log.debug("Flicks found: " + flicks.stream().map(flick -> flick.getId()).collect(Collectors.toList()).toString());
        List<FlickDTO> flickDTOs = flicks.stream()
                .map(flick -> dtoMappingService.toFlickDTO(flick))
                .collect(Collectors.toList());

        return flickDTOs;
    }

    private Optional<Flick> findSingleFlickWithNoUserFlickForTagAndUser(Long userId, Long tagId, List<Long> foundFlicksIds) {
        Tag tag = tagsRepository.findById(tagId).orElse(null);
        if (tag == null) {
            log.info("Tag not found in findSingleFlickWithNoUserFlickForTagAndUser");
            return Optional.empty();
        }
        Pageable pageable = PageRequest.of(0, 1);
        Page<Flick> flicks = flicksRepository.findFirstByTagIdAndNotInUserFlicks(tag, userId, foundFlicksIds, pageable);
        if (flicks.isEmpty() || foundFlicksIds.contains(flicks.getContent().get(0).getId())) {
            return Optional.empty();
        }
        return Optional.of(flicks.getContent().get(0));
    }

    private Optional<Flick> findSingleFlickWithNoUserFlickForUser(Long userId, List<Long> foundFlicksIds) {
        Pageable pageable = PageRequest.of(0, 1);
        Page<Flick> flicks = flicksRepository.findFirstByUserIdAndNotInUserFlicks(userId, foundFlicksIds, pageable);
        if (flicks.isEmpty() || foundFlicksIds.contains(flicks.getContent().get(0).getId())) {
            return Optional.empty();
        }
        return Optional.of(flicks.getContent().get(0));
    }

    private Optional<Flick> getRandomFlick(User user, List<Long> foundFlicksIds){
        Collections.shuffle(user.getDefaultTags());
        for (Tag tag : user.getDefaultTags()) {
            return findSingleFlickWithNoUserFlickForTagAndUser(user.getId(), tag.getId(), foundFlicksIds);
        }
        return Optional.empty();
    }
}
