package org.tailor.api.tailorback.requests;

import lombok.Data;

@Data
public class PonderationRequest {
    private String latitude;
    private String longitude;
    private String watchedAt;
}

