package com.tailor.profiling.requests;

import java.util.List;

import lombok.Data;

@Data
public class UserFlickRequest {
    private List<Long> tagIds;

    private Float watchedDuring = 0F;

    private Boolean isYay = false;
    private Boolean isNay = false;
    private Boolean isLiked = false;
    private Boolean isShared = false;

    private String latitude;
    private String longitude;
    private String watchedAt;
}
