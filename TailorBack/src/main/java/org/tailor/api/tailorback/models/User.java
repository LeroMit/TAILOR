package org.tailor.api.tailorback.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.ArrayList;
import java.util.List;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String bio;
    private String photoUrl;
    @Column(unique = true, length = 20)
    private String username;
    private String lastName;
    private String firstName;

    // TODO: Foreign key for user auth table
    // private String userAuth;

    @OneToMany(mappedBy = "createdBy")
    private List<Tailor> tailors;

    @OneToMany(mappedBy = "postedBy")
    private List<Flick> flicks;

    @ManyToMany
    private List<Tag> defaultTags;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "user")
    @Builder.Default
    @ToString.Exclude
    private List<SubscriptionConversation> subscriptionsConversations = new ArrayList<>();

    private Long selectedTailorId;

    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant updatedOn;
}
