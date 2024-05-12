package org.tailor.api.tailorback.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String bio;
    private String photoUrl;
    private String username;
    private String firstName;
    private String lastName;
}
