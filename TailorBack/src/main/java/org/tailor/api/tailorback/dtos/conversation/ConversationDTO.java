package org.tailor.api.tailorback.dtos.conversation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

import org.tailor.api.tailorback.dtos.message.MessageDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Long id;
    private String title;
    private String photoUrl;
    private List<MessageDTO> messages;
    private Instant createdOn;
    private Instant updatedOn;
}
