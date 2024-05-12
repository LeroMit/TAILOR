package com.tailor.profiling.models;

import java.util.HashMap;
import java.util.List;

import lombok.Data;

@Data
public class SubProfileDefault {
    private Float tagThreshold;
    private HashMap<Long, Float> tagScores;
    private static final Float TAG_THRESHOLD = 40f;

    /**
     * Default constructor
     */
    public SubProfileDefault() {
        this.tagThreshold = TAG_THRESHOLD;
        this.tagScores = new HashMap<>();
    }

    /**
     * Constructor when profile has never been created yet
     * 
     * @param tags
     */
    public SubProfileDefault(Float tagThreshold) {
        this.tagThreshold = tagThreshold;
        this.tagScores = new HashMap<>();
    }

    /**
     * Constructor when profile has never been created yet
     * 
     * @param tags
     */
    public SubProfileDefault(List<Long> tags) {
        this.tagThreshold = TAG_THRESHOLD;
        this.tagScores = new HashMap<>();
        tags.forEach(tagId -> this.tagScores.put(tagId, 100F));
    }

    /**
     * Constructor when profile has never been created yet
     *
     * @param tagIds
     * @param tagThreshold
     */
    public SubProfileDefault(List<Long> tagIds, Float tagThreshold) {
        this.tagThreshold = tagThreshold;
        this.tagScores = new HashMap<>();
        tagIds.forEach(tagId -> this.tagScores.put(tagId, 100F));
    }

    /**
     * Constructor of copy of a subProfileDefault
     * 
     * @param tagScores
     * @param tagThreshold
     */
    public SubProfileDefault(HashMap<Long, Float> tagScores, Float tagThreshold) {
        this.tagThreshold = tagThreshold;
        this.tagScores = new HashMap<>();
        tagScores.forEach((tagId, score) -> this.tagScores.put(tagId, score));
    }

    /**
     * Constructor of copy of a subProfileDefault
     * 
     * @param tagScores
     */
    public SubProfileDefault(HashMap<Long, Float> tagScores) {
        this.tagThreshold = TAG_THRESHOLD;
        this.tagScores = new HashMap<>();
        tagScores.forEach((tagId, score) -> this.tagScores.put(tagId, score));
    }

    /**
     * Add a tag to the current one
     * 
     * @param id
     * @param score
     */
    public void addTag(Long id, Float score) {
        this.tagScores.put(id, score);
    }

    /**
     * Add a subProfileDefault to the current one and returns the result
     * 
     * @param subProfileDefault
     * @return {@link SubProfileDefault}
     */
    public SubProfileDefault add(SubProfileDefault subProfileDefault) {
        SubProfileDefault newSubProfileDefault = new SubProfileDefault(this.tagScores,
                this.tagThreshold + subProfileDefault.getTagThreshold());
        subProfileDefault.getTagScores().forEach((tagId, score) -> {
            if (newSubProfileDefault.getTagScores().containsKey(tagId)) {
                newSubProfileDefault.getTagScores().put(tagId, newSubProfileDefault.getTagScores().get(tagId) + score);
            } else {
                newSubProfileDefault.getTagScores().put(tagId, score);
            }
        });
        return newSubProfileDefault;
    }

    /**
     * Subs a subProfileDefault to the current one and returns the result
     * 
     * @param subProfileDefault
     * @return {@link SubProfileDefault}
     */
    public SubProfileDefault sub(SubProfileDefault subProfileDefault) {
        SubProfileDefault newSubProfileDefault = new SubProfileDefault(this.tagScores,
                this.tagThreshold + subProfileDefault.getTagThreshold());
        subProfileDefault.getTagScores().forEach((tagId, score) -> {
            if (newSubProfileDefault.getTagScores().containsKey(tagId)) {
                Float calculatedScore = newSubProfileDefault.getTagScores().get(tagId) - score;
                if (calculatedScore > 0) {
                    newSubProfileDefault.getTagScores().put(tagId, calculatedScore);
                } else {
                    newSubProfileDefault.getTagScores().remove(tagId);
                }
            } else {
                newSubProfileDefault.getTagScores().put(tagId, score);
            }
        });
        return newSubProfileDefault;
    }

    /**
     * Filter the tagScores with the tagThreshold
     * 
     * @return {@link SubProfileDefault}
     */
    public SubProfileDefault filterOnTagThreshold() {
        SubProfileDefault newSubProfileDefault = new SubProfileDefault(this.tagScores, this.tagThreshold);
        newSubProfileDefault.getTagScores().entrySet().removeIf(entry -> entry.getValue() < this.tagThreshold);
        return newSubProfileDefault;
    }

    /**
     * Sum the tagScores and return the result
     * 
     * @return {@link SubProfileDefault}
     */
    public SubProfileDefault sum() {
        SubProfileDefault newSubProfileDefault = new SubProfileDefault(this.tagScores, this.tagThreshold);
        newSubProfileDefault.getTagScores().clear();
        Float sum = this.computeSumValue();
        newSubProfileDefault.getTagScores().put(0L, sum);
        return newSubProfileDefault;
    }

    /**
     * Normalize the tagScores and return the result
     * 
     * @return {@link SubProfileDefault}
     */
    public SubProfileDefault normalize() {
        SubProfileDefault newSubProfileDefault = new SubProfileDefault(this.tagScores, this.tagThreshold);
        Float sum = this.computeSumValue();
        newSubProfileDefault.getTagScores()
                .forEach((tagId, score) -> newSubProfileDefault.getTagScores().put(tagId, score / sum));
        return newSubProfileDefault;
    }

    /**
     * Sum the tagScores and return the result
     * 
     * @return {@link SubProfileDefault}
     */
    public Float computeSumValue() {
        return this.tagScores.values().stream().reduce(0f, Float::sum);
    }
}
