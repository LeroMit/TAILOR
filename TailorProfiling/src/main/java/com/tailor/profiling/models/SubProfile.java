package com.tailor.profiling.models;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubProfile {
    private Set<KeysSubProfileDefault> data;
    private Float keyThreshold;

    public SubProfile(Float keyThreshold) {
        this.keyThreshold = keyThreshold;
        this.data = new HashSet<>();
    }

    /**
     * Constructor of copy of a subProfile
     * 
     * @param tagThreshold
     * @param keyThreshold
     * @param data
     */
    public SubProfile(Float keyThreshold, Set<KeysSubProfileDefault> data) {
        this.keyThreshold = keyThreshold;
        this.data = new HashSet<>();
        data.forEach((KeysSubProfileDefault) -> {
            this.data.add(KeysSubProfileDefault);
        });
    }

    /**
     * Add a subProfile to the current one and modify the current object
     * The key is a set of strings
     *
     * @param discreteValueIds
     * @param subProfile
     */
    public void addSubProfileDefaultWithKeySet(List<String> discreteValueIds, SubProfileDefault subProfileDefault) {
        KeysSubProfileDefault keysSubProfileDefault = new KeysSubProfileDefault(discreteValueIds, subProfileDefault);
        KeysSubProfileDefault foundKeysSubProfileDefault = this.data.stream() // Le but c'est de trouver si la clé
                                                                              // existe déjà, si c'est le cas remplace
                .filter(keysSubProfileDefault2 -> keysSubProfileDefault2.getKeys().equals(discreteValueIds))
                .findFirst().orElse(null);

        if (foundKeysSubProfileDefault != null) {
            this.data.remove(foundKeysSubProfileDefault);
        }
        this.data.add(keysSubProfileDefault);
    }

    /**
     * Add a subProfile to the current one and returns the result
     * 
     * @param id
     * @param subProfile
     */
    public SubProfile addDimension(String discreteValueId, SubProfileDefault subProfile) {
        this.data.forEach((keysSubProfileDefault) -> {
            keysSubProfileDefault.getKeys().add(discreteValueId);
            keysSubProfileDefault.getSubProfileDefault().add(subProfile);
            this.data.add(keysSubProfileDefault);
        });
        return this;
    }

    /**
     * Add a subProfile to the current one and returns the result
     * 
     * @param discreteValueId
     * @param subProfileDefault
     */
    public void addSubProfileDefault(String discreteValueId, SubProfileDefault subProfileDefault) {
        List<String> discreteValueIds = new ArrayList<>(Arrays.asList(discreteValueId));
        KeysSubProfileDefault keysSubProfileDefault = new KeysSubProfileDefault(discreteValueIds, subProfileDefault);
        this.data.add(keysSubProfileDefault);
    }

    /**
     * Add a subProfile to the current one and returns the result
     * 
     * @param subProfile
     * @return {@link SubProfile}
     */
    public SubProfile addASubProfile(SubProfile subProfile) {
        SubProfile result = new SubProfile(
                this.keyThreshold + subProfile.getKeyThreshold());
        if (subProfile.getData().isEmpty()) {
            this.data.forEach((keysSubProfileDefault) -> {
                List<String> discreteValueIds = keysSubProfileDefault.getKeys();
                SubProfileDefault subProfileDefault = keysSubProfileDefault.getSubProfileDefault();
                result.addSubProfileDefaultWithKeySet(discreteValueIds, subProfileDefault);
                subProfile.getData().forEach((keysSubProfileDefault2) -> {
                    List<String> existingDiscreteValueIds = keysSubProfileDefault2.getKeys();
                    SubProfileDefault existingSubProfileDefault = keysSubProfileDefault2.getSubProfileDefault();
                    List<String> newDiscreteValueIds = new ArrayList<>(existingDiscreteValueIds);
                    newDiscreteValueIds.addAll(discreteValueIds);
                    SubProfileDefault sumSubProfileDefault = existingSubProfileDefault.add(subProfileDefault);
                    KeysSubProfileDefault newKeysSubProfileDefault = new KeysSubProfileDefault(newDiscreteValueIds,
                            sumSubProfileDefault);
                    result.getData().add(newKeysSubProfileDefault);
                });
            });
        } else {
            subProfile.getData().forEach((keysSubProfileDefault) -> {
                List<String> discreteValueIds = keysSubProfileDefault.getKeys();
                SubProfileDefault subProfileDefault = keysSubProfileDefault.getSubProfileDefault();
                result.addSubProfileDefaultWithKeySet(discreteValueIds, subProfileDefault);
                this.data.forEach((keysSubProfileDefault2) -> {
                    List<String> existingDiscreteValueIds = keysSubProfileDefault2.getKeys();
                    SubProfileDefault existingSubProfileDefault = keysSubProfileDefault2.getSubProfileDefault();

                    result.addSubProfileDefaultWithKeySet(existingDiscreteValueIds, existingSubProfileDefault);
                    List<String> newDiscreteValueIds = new ArrayList<>(existingDiscreteValueIds);
                    newDiscreteValueIds.addAll(discreteValueIds);
                    SubProfileDefault sumSubProfileDefault = existingSubProfileDefault.add(subProfileDefault);
                    KeysSubProfileDefault newKeysSubProfileDefault = new KeysSubProfileDefault(newDiscreteValueIds,
                            sumSubProfileDefault);
                    result.getData().add(newKeysSubProfileDefault);
                });
            });
        }
        return result;
    }

    /**
     * Add all subProfiles to the current one and returns the result
     * 
     * @param subProfiles
     * @return {@link SubProfile}
     */
    public static SubProfile addAllSubProfiles(List<SubProfile> subProfiles) {
        SubProfile result = new SubProfile(0F);

        for (SubProfile subProfile : subProfiles) {
            result = result.addASubProfile(subProfile);
        }
        return result;
    }

    /**
     * Add a SubProfile whose keys are the same as the current one
     * 
     * @param subProfile
     * @return
     */
    public SubProfile addSubProfileWithSameKeys(SubProfile subProfile) {
        SubProfile result = new SubProfile(this.keyThreshold + subProfile.getKeyThreshold());
        subProfile.getData().forEach((keysSubProfileDefault) -> {
            List<String> discreteValueIds = keysSubProfileDefault.getKeys();
            SubProfileDefault subProfileDefault = keysSubProfileDefault.getSubProfileDefault();

            this.data.forEach((keysSubProfileDefault2) -> {
                List<String> existingDiscreteValueIds = keysSubProfileDefault2.getKeys();
                SubProfileDefault existingSubProfileDefault = keysSubProfileDefault2.getSubProfileDefault();

                if (discreteValueIds.equals(existingDiscreteValueIds)) {
                    SubProfileDefault sumSubProfileDefault = existingSubProfileDefault.add(subProfileDefault);
                    KeysSubProfileDefault keysSubProfileDefaultResult = new KeysSubProfileDefault(
                            existingDiscreteValueIds, sumSubProfileDefault);
                    result.getData().add(keysSubProfileDefaultResult);
                }
            });
        });
        return result;
    }

    /**
     * Sub a subProfile to the current one and returns the result
     * 
     * @param subProfile
     * @return {@link SubProfile}
     */
    public SubProfile subASubProfile(SubProfile subProfile) {
        SubProfile result = new SubProfile(
                this.keyThreshold + subProfile.getKeyThreshold());
        subProfile.getData().forEach((keysSubProfileDefault) -> {
            List<String> discreteValueIds = keysSubProfileDefault.getKeys();
            SubProfileDefault subProfileDefault = keysSubProfileDefault.getSubProfileDefault();

            this.data.forEach((keysSubProfileDefault2) -> {
                List<String> existingDiscreteValueIds = keysSubProfileDefault2.getKeys();
                SubProfileDefault existingSubProfileDefault = keysSubProfileDefault2.getSubProfileDefault();

                Set<String> newDiscreteValueIds = new HashSet<>(existingDiscreteValueIds);
                newDiscreteValueIds.addAll(discreteValueIds);
                SubProfileDefault subSubProfileDefault = existingSubProfileDefault.sub(subProfileDefault);
                KeysSubProfileDefault keysSubProfileDefaultResult = new KeysSubProfileDefault(
                        new ArrayList<>(newDiscreteValueIds),
                        subSubProfileDefault);
                result.getData().add(keysSubProfileDefaultResult);
            });
        });
        return result;
    }

    /**
     * Sub all subProfiles to the current one and returns the result
     * 
     * @param subProfiles
     * @return {@link SubProfile}
     */
    public static SubProfile subAllSubProfiles(List<SubProfile> subProfiles) {
        SubProfile initialSubProfile = subProfiles.get(0);
        SubProfile result = new SubProfile(initialSubProfile.getKeyThreshold(),
                initialSubProfile.getData());
        for (int i = 1; i < subProfiles.size(); i++) {
            SubProfile subProfile = subProfiles.get(i);
            result = result.subASubProfile(subProfile);
        }
        return result;
    }

    /**
     * Sub a SubProfile whose keys are the same as the current one
     * 
     * @param subProfile
     * @return
     */
    public SubProfile subSubProfileWithSameKeys(SubProfile subProfile) {
        SubProfile result = new SubProfile(
                this.keyThreshold + subProfile.getKeyThreshold());
        subProfile.getData().forEach((keysSubProfileDefault) -> {
            List<String> discreteValueIds = keysSubProfileDefault.getKeys();
            SubProfileDefault subProfileDefault = keysSubProfileDefault.getSubProfileDefault();

            this.data.forEach((keysSubProfileDefault2) -> {
                List<String> existingDiscreteValueIds = keysSubProfileDefault2.getKeys();
                SubProfileDefault existingSubProfileDefault = keysSubProfileDefault2.getSubProfileDefault();

                if (discreteValueIds.equals(existingDiscreteValueIds)) {
                    SubProfileDefault subSubProfileDefault = existingSubProfileDefault.sub(subProfileDefault);
                    KeysSubProfileDefault keysSubProfileDefaultResult = new KeysSubProfileDefault(
                            existingDiscreteValueIds, subSubProfileDefault);
                    result.getData().add(keysSubProfileDefaultResult);
                }
            });
        });
        return result;
    }

    /**
     * Filter the subProfiles with the tagThreshold
     * 
     * @return
     */
    public SubProfile filterOnTagThreshold() {
        SubProfile result = new SubProfile(this.keyThreshold);
        this.data.forEach((keysSubProfileDefault -> {
            List<String> discreteValueIds = keysSubProfileDefault.getKeys();
            SubProfileDefault subProfileDefault = keysSubProfileDefault.getSubProfileDefault();

            SubProfileDefault subProfileDefaultFiltered = subProfileDefault.filterOnTagThreshold();
            result.addSubProfileDefaultWithKeySet(discreteValueIds, subProfileDefaultFiltered);
        }));
        return result;
    }

    /**
     * Filter the subProfiles with the keyThreshold
     * 
     * @return {@link SubProfile}
     */
    public SubProfile filterOnKeyTreshold() {
        SubProfile result = new SubProfile(this.keyThreshold);
        this.data.forEach((keysSubProfileDefault) -> {
            List<String> discreteValueIds = keysSubProfileDefault.getKeys();
            SubProfileDefault subProfileDefault = keysSubProfileDefault.getSubProfileDefault();

            if (subProfileDefault.computeSumValue() > this.keyThreshold) {
                result.addSubProfileDefaultWithKeySet(discreteValueIds, subProfileDefault);
            }
        });
        return result;
    }

    /**
     * Recursively normalize the tagScores
     * 
     * @return {@link SubProfile}
     */
    public SubProfile normalize() {
        SubProfile result = new SubProfile(this.keyThreshold);
        this.data.forEach((keysSubProfileDefault -> {
            List<String> discreteValueIds = keysSubProfileDefault.getKeys();
            SubProfileDefault subProfileDefault = keysSubProfileDefault.getSubProfileDefault();

            SubProfileDefault subProfileDefaultFiltered = subProfileDefault.normalize();
            result.addSubProfileDefaultWithKeySet(discreteValueIds, subProfileDefaultFiltered);
        }));
        return result;
    }

    public String toAdjencyListString() {
        StringBuilder sb = new StringBuilder();
        this.data.forEach((keysSubProfileDefault -> {
            List<String> discreteValueIds = keysSubProfileDefault.getKeys();

            sb.append(discreteValueIds.toString());
            sb.append(" -> ");
            // sb.append(subProfileDefault.toAdjencyListString());
            sb.append("\n");
        }));
        return sb.toString();
    }
}

/*
 * 1. calcul des 3 profiles SubProfileDefault SubProfileTime SubProfileLocation
 * 2. filtrer avec treshold sur default
 * 3. somme scores pour chaque key de time -> SubProfileTime
 * 4. somme scores pour chaque key de loc -> SubProfileLocation
 * 5. Treshold sur 3. -> SubProfileTime
 * 6. Treshold sur 4. -> SubProfileLocation
 * 7. communion de 5. et 6. -> SubProfileResult(HashMap<Pair<idLoc,
 * idTemps>,SubProfileDefault>)
 */