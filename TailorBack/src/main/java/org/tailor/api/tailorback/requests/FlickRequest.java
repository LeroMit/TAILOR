package org.tailor.api.tailorback.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlickRequest {
    @NotEmpty(message = "The label is required.")
    private String title;
    private String description;
    private String url;

    // @NotEmpty(message = "The flick must have tags.")
    private List<Long> tagsIds;

    private List<TagRequest> tagsToCreate;

    @NotNull(message = "The creatorId is required.")
    private Long creatorId;
}
