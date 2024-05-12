package org.tailor.api.tailorback.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Conversations")
public class Conversation {
    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "subscribedConversation", fetch = FetchType.EAGER)
    @Builder.Default
    private List<SubscriptionConversation> subscriptions = new ArrayList<>();

    @OrderBy("createdOn DESC")
    @OneToMany(mappedBy = "conversation", fetch = FetchType.EAGER)
    @Builder.Default
    private List<Message> messages = new ArrayList<>();


    private String title;
    private String photoUrl;

    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant updatedOn;
}
