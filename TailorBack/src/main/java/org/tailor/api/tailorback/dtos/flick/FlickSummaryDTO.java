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
public class FlickSummaryDTO {
    private Long id;

    private String title;
    private String description;
    private String url;

    private UserSummaryDTO postedBy;


    private Instant createdOn;
    private Instant updatedOn;
}
