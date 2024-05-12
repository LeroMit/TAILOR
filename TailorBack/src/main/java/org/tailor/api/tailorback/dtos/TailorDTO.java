package org.tailor.api.tailorback.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tailor.api.tailorback.dtos.user.UserSummaryDTO;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TailorDTO {
    private Long id;

    private String title;
    private Boolean isLocked;
    private Boolean isPublic;
    private Boolean isFavourite;

    private UserSummaryDTO createdBy;

    private Instant createdOn;
    private Instant updatedOn;
}
