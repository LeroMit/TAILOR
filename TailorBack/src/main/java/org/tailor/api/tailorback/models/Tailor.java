package org.tailor.api.tailorback.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Tailors")
public class Tailor {
    @Id
    @GeneratedValue
    private Long id;

    private String title;
    @Builder.Default
    private Boolean isLocked = false;
    @Builder.Default
    private Boolean isPublic = false;
    @Builder.Default
    private Boolean isFavourite = false;

    @ManyToOne(fetch = FetchType.LAZY, cascade = { CascadeType.REFRESH })
    @JoinColumn(name = "createdById")
    private User createdBy;

    @Builder.Default
    private Integer counterUserFlicks = 0;

    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant updatedOn;
}
