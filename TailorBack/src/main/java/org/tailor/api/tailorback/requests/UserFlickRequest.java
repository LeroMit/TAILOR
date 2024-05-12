package org.tailor.api.tailorback.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFlickRequest {
    private Long idFlick;

    @NotNull(message = "The watchedDuring is required.")
    private Float watchedDuring;

    @Builder.Default
    private Boolean isYay = false;

    @Builder.Default
    private Boolean isNay = false;

    @Builder.Default
    private Boolean isLiked = false;

    @Builder.Default
    private Boolean isShared = false;

    private String latitude;
    private String longitude;

    @NotEmpty(message = "The watchedAt is required.")
    @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])T([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)([+-](0\\d|1[0-2]):([0-5]\\d))$", message = "The watchedAt needs to be formatted like (e.g. \"2011-12-03T10:15:30+01:00\").")
    private String watchedAt;
}
