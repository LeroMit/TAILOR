package org.tailor.api.tailorback.dtos.tag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {
    private Long id;

    private String label;

    private Instant createdOn;
    private Instant updatedOn;
}
