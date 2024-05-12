package org.tailor.api.tailorback.requests;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TailorRequest {
    @NotEmpty(message = "The title is required.")
    private String title;
    private Boolean isLocked = false;
    private Boolean isPublic = false;
    private Boolean isFavourite = false;
}
