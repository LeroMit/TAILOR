package org.tailor.api.tailorback.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class UserFlickKey implements Serializable {
    @NotNull
    private Long userId;
    @NotNull
    private Long flickId;
}
