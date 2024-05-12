package org.tailor.api.tailorback.dtos.conversation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LastConversationMessageDTO {
    private Long conversationId;

    private String profilePictureUrl;
    private String name;
    private String content;
    @Builder.Default
    private Boolean isRead = false;
    private Boolean isSentByUser;

    private Instant createdOn;
    private Instant updatedOn;
}
