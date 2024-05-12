package org.tailor.api.tailorback.dtos.flick;

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
public class FlickShareDTO {
    private Long id;

    private FlickSummaryDTO flick;

    private UserSummaryDTO user;
    private UserSummaryDTO to;

    private Instant createdOn;
    private Instant updatedOn;
}
