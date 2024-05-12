package org.tailor.api.tailorback.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "SubscriptionsToConversations")
public class SubscriptionConversation {
    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private Conversation subscribedConversation;

    @Builder.Default
    private Instant timeLastOpened = Instant.ofEpochMilli(0);

    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant updatedOn;

    public enum Status {
        ACTIVE,
        ARCHIVED,
        HIDDEN;
    }
}
