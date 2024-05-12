package org.tailor.api.tailorback.requests;

import java.util.HashMap;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagPonderationRequest {
    @NotEmpty(message = "The dictionnary is required.")
    private HashMap<Long, Double> tagPonderationMap;

}
