package org.tailor.api.tailorback.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tailor.api.tailorback.dtos.user.UserSummaryDTO;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;

    private String message;


    // TODO     private List<Reply> replies;

    private List<UserSummaryDTO> mentions;
    private UserSummaryDTO postedBy;


    private Instant createdOn;
    private Instant updatedOn;
}
