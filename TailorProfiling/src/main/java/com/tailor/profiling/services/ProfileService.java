package com.tailor.profiling.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;

import com.tailor.profiling.models.KeysSubProfileDefault;
import com.tailor.profiling.models.Profile;
import com.tailor.profiling.models.SubProfile;
import com.tailor.profiling.repositories.ProfileRepository;
import com.tailor.profiling.models.SubProfileDefault;
import com.tailor.profiling.models.SubProfileLocationWindow;
import com.tailor.profiling.models.SubProfileTimeWindow;
import com.tailor.profiling.models.UserFlick;

import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@NoArgsConstructor
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    /**
     * Create a profile
     * 
     * @param tailorId
     * @param defaultIds
     * @return
     */
    public Profile createProfile(Long tailorId, List<Long> defaultIds) {
        log.debug("Creating profile for tailorId: " + tailorId);
        Profile newProfile = new Profile(tailorId.toString());
        newProfile = profileRepository.save(newProfile);
        return newProfile;
    }

    /**
     * Get a profile by tailorId
     * 
     * @param tailorId
     * @return
     */
    public Optional<Profile> getProfile(Long tailorId) {
        log.debug("Fetching profile for tailorId: " + tailorId);
        return profileRepository.findById(tailorId.toString());
    }

    /**
     * Update a profile by adding and removing views
     * 
     * @param profile
     * @param viewsToAdd
     * @param viewsToRemove
     * @return
     */
    public Profile updateProfile(Profile profile, List<UserFlick> viewsToAdd, List<UserFlick> viewsToRemove) {
        log.debug("Updating profile for tailorId: " + profile.get_tailorId());

        SubProfileDefault currentDefaults = profile.getDefaults();
        SubProfile currentLocationWindow = profile.getSubProfileLocationWindow();
        SubProfile currentTimeWindow = profile.getSubProfileTimeWindow();

        for (UserFlick view : viewsToAdd) {
            Integer score = view.getScore();
            HashMap<Long, Float> tagScores = new HashMap<>();
            view.getTags().forEach(tag -> tagScores.put(tag, (float) score));
            SubProfileDefault tempSubProfileDefault = new SubProfileDefault(tagScores);

            currentDefaults = currentDefaults.add(tempSubProfileDefault);

            String locationId = view.getLocalisation();
            currentLocationWindow = modifySubProfile(currentLocationWindow,
                    tempSubProfileDefault,
                    locationId, true);

            String timeId = view.getTimeWindow();
            currentTimeWindow = modifySubProfile(currentTimeWindow,
                    tempSubProfileDefault, timeId, true);
        }

        for (UserFlick view : viewsToRemove) {
            Integer score = view.getScore();
            HashMap<Long, Float> tagScores = new HashMap<>();
            view.getTags().forEach(tag -> tagScores.put(tag, (float) score));
            SubProfileDefault tempSubProfileDefault = new SubProfileDefault(tagScores);

            currentDefaults = currentDefaults.add(tempSubProfileDefault);

            String locationId = view.getLocalisation();
            currentLocationWindow = modifySubProfile((SubProfile) currentLocationWindow, tempSubProfileDefault,
                    locationId, false);

            String timeId = view.getTimeWindow();
            currentTimeWindow = modifySubProfile(currentTimeWindow, tempSubProfileDefault, timeId, false);
        }
        profile.setDefaults(currentDefaults);
        profile.setSubProfileLocationWindow((SubProfileLocationWindow) currentLocationWindow);
        profile.setSubProfileTimeWindow((SubProfileTimeWindow) currentTimeWindow);

        profile = profileRepository.save(profile);
        return profile;
    }

    /**
     * 
     * @param profile
     * @param subProfileDefaultToRecommand
     * @return
     */
    public SubProfile generateSubProfileFromDefault(SubProfileDefault subProfileDefaultToRecommand) {
        SubProfile subProfile = new SubProfile(0f,
                generateSummaryMapFromDefault(subProfileDefaultToRecommand));
        return subProfile;
    }

    public Set<KeysSubProfileDefault> generateSummaryMapFromDefault(SubProfileDefault subProfileDefaultToRecommand) {
        log.debug("Generating summary map from default");

        Set<KeysSubProfileDefault> data = new HashSet<>();
        KeysSubProfileDefault keysSubProfileDefault = new KeysSubProfileDefault(new ArrayList<>(),
                subProfileDefaultToRecommand);
        data.add(keysSubProfileDefault);
        return data;
    }

    public SubProfile generateProfileSummary(Profile profile) {
        List<SubProfile> subProfiles = new ArrayList<>();
        SubProfile subProfileDefault = generateSubProfileFromDefault(profile.getDefaults());
        subProfiles.add(subProfileDefault.filterOnTagThreshold());
        subProfiles.add(profile.getSubProfileLocationWindow().filterOnTagThreshold().filterOnKeyTreshold());
        subProfiles.add(profile.getSubProfileTimeWindow().filterOnTagThreshold().filterOnKeyTreshold());

        SubProfile result = SubProfile.addAllSubProfiles(subProfiles);
        Float sum = 0F;
        for (KeysSubProfileDefault keysSubProfileDefault : result.getData()) {
            sum += keysSubProfileDefault.getSubProfileDefault().computeSumValue();
        }
        result.setKeyThreshold(sum / result.getData().size());
        result = result.filterOnKeyTreshold().normalize();

        profile.setSummary(result);
        profile = profileRepository.save(profile);

        return profile.getSummary();
    }

    /**
     * Get tags from a profile summary
     * 
     * @param profile
     * @param localisation
     * @param timeWindow
     * @return
     */
    public HashMap<Long, Float> getTagsWithScoreFromProfileSummary(Profile profile, String localisation,
            String timeWindow) {
        SubProfileDefault subProfileDefaultToRecommand = new SubProfileDefault();
        boolean keyFound = false;
        SubProfile subProfile = profile.getSummary();
        for (KeysSubProfileDefault keysSubProfileDefault : subProfile.getData()) {
            boolean containLocalisation = keysSubProfileDefault.getKeys().contains(localisation);
            boolean containTimeWindow = keysSubProfileDefault.getKeys().contains(timeWindow);
            int size = keysSubProfileDefault.getKeys().size();
            if (containLocalisation && containTimeWindow) {
                keyFound = true;
                subProfileDefaultToRecommand = keysSubProfileDefault.getSubProfileDefault();
                break;
            } else if (size == 1 && (containLocalisation || containTimeWindow)) {
                keyFound = true;
                subProfileDefaultToRecommand = keysSubProfileDefault.getSubProfileDefault();
            }
        }

        if (!keyFound) {
            subProfileDefaultToRecommand = profile.getDefaults();
        }

        HashMap<Long, Float> tagsWithPonderation = new HashMap<>();
        subProfileDefaultToRecommand.normalize().getTagScores().forEach((key, value) -> {
            tagsWithPonderation.put(key, value);
        });
        return tagsWithPonderation;
    }

    /**
     * Get tags from a profile summary
     * 
     * @param profile
     * @return
     */
    public List<Long> getTagsFromProfileSummary(Profile profile) {
        SubProfile subProfile = profile.getSummary();
        List<Long> tags = new ArrayList<>();
        HashMap<Long, Float> tagsWithScore = new HashMap<>();
        subProfile.getData().forEach(keysSubProfileDefault -> {
            keysSubProfileDefault.getSubProfileDefault().getTagScores().forEach((key, value) -> {
                if (tagsWithScore.containsKey(key)) {
                    tagsWithScore.put(key, tagsWithScore.get(key) + value);
                } else {
                    tagsWithScore.put(key, value);
                }
            });
        });
        tagsWithScore.entrySet().stream().sorted((entry1, entry2) -> {
            return entry1.getValue().compareTo(entry2.getValue());
        }).forEach(entry -> {
            tags.add(entry.getKey());
        });
        return tags;
    }

    /**
     * Modify a subProfile with a subProfileDefault
     * 
     * @param subProfile
     * @param subProfileDefaultUserView
     * @param id
     * @param add
     * @return
     */
    private SubProfile modifySubProfile(SubProfile subProfile, SubProfileDefault subProfileDefaultUserView, String id,
            boolean add) {
        log.debug("Modifying subProfile with id: " + id + " and add: " + add);
        List<String> set = new ArrayList<>(Arrays.asList(id));
        Set<KeysSubProfileDefault> keysSubProfileDefaults = subProfile.getData();

        Optional<KeysSubProfileDefault> foundKeySubProfileDefault = keysSubProfileDefaults.stream()
                .filter((keysSubProfileDefault) -> {
                    return keysSubProfileDefault.getKeys().contains(id);
                }).findFirst();

        if (foundKeySubProfileDefault.isEmpty()) {
            if (add) {
                subProfile.addSubProfileDefaultWithKeySet(set, subProfileDefaultUserView);
            }
        } else {
            SubProfileDefault finalSubProfileDefault = foundKeySubProfileDefault.get().getSubProfileDefault();
            if (add) {
                finalSubProfileDefault = finalSubProfileDefault.add(subProfileDefaultUserView);
            } else {
                finalSubProfileDefault = finalSubProfileDefault.sub(subProfileDefaultUserView);
            }
            subProfile.addSubProfileDefaultWithKeySet(set, finalSubProfileDefault);
        }
        return subProfile;
    }
}