package org.tailor.api.tailorback.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.ZonedDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "UserFlick")
public class UserFlick {
    @EmbeddedId
    private UserFlickKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("flickId")
    @JoinColumn(name = "flick_id")
    private Flick flick;

    private Float watchedDuring = 0F;

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
    private ZonedDateTime watchedAt;

    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant updatedOn;

    @Builder
    public UserFlick(User user, Flick flick, Float watchedDuring, Boolean isYay, Boolean isNay, Boolean isLiked, Boolean isShared) {
        this.id = new UserFlickKey(user.getId(), flick.getId());
        this.user = user;
        this.flick = flick;
        this.watchedDuring = watchedDuring;
        this.isYay = isYay;
        this.isNay = isNay;
        this.isLiked = isLiked;
        this.isShared = isShared;
    }
}
