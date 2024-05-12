package org.tailor.api.tailorback.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 This class represents the request to create a conversation.
 It contains the creator id, the user ids (including creator), and the content.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationRequest {
    @NotNull(message = "The creator id is required.")
    private Long creatorId;
    @NotEmpty(message = "The user ids cannot be empty.")
    private List<Long> userIds;
    @NotEmpty(message = "The content is required.")
    private String content;
}
