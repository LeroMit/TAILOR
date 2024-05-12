package org.tailor.api.tailorback.dtos.flick;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tailor.api.tailorback.dtos.CommentDTO;
import org.tailor.api.tailorback.dtos.tag.TagDTO;
import org.tailor.api.tailorback.dtos.user.UserSummaryDTO;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlickDTO {
    private Long id;

    private String title;
    private String description;
    private String url;

    private List<CommentDTO> comments;

    private List<TagDTO> tags;

    private UserSummaryDTO postedBy;


    private Instant createdOn;
    private Instant updatedOn;
}
