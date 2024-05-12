package org.tailor.api.tailorback.dtos.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

import org.tailor.api.tailorback.dtos.user.UserSummaryDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private UserSummaryDTO writtenBy;
    private String content;
    private Instant createdOn;
    private Instant updatedOn;
}
