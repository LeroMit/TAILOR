package org.tailor.api.tailorback.requests;

import lombok.Data;

@Data
public class FeedParamsRequest {
    private Long nbVideos = 10L;
    private String latitude;
    private String longitude;
    private String watchedAt;
}
