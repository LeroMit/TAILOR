package org.tailor.api.tailorback.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.tailor.api.tailorback.dtos.tag.TagDTO;
import org.tailor.api.tailorback.dtos.TailorDTO;
import org.tailor.api.tailorback.dtos.flick.FlickSummaryDTO;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;

    private String bio;
    private String photoUrl;
    private String firstName;
    private String lastName;
    private String username;
    // private String userAuth;

    private Long selectedTailorId;
    private List<TailorDTO> tailors;
    private List<FlickSummaryDTO> flicks;
    private List<TagDTO> defaultTags;

    private Instant createdOn;
    private Instant updatedOn;
}
