package com.tailor.profiling.requests;

import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {
    private List<UserFlickRequest> userFlickRequestToAdd;
    private List<UserFlickRequest> userFlickRequestToRemove;

}
