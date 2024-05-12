package org.tailor.api.tailorback.requests;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplyRequest {
    @NotEmpty(message = "The reply is required.")
    private String message;

    private List<Long> mentions;
    private Long posterId;
}
