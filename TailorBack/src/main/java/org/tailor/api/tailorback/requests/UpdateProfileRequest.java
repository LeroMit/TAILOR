package org.tailor.api.tailorback.requests;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UpdateProfileRequest {
    private List<UserFlickRequest> userFlickRequestToAdd;
    private List<UserFlickRequest> userFlickRequestToRemove;
}
