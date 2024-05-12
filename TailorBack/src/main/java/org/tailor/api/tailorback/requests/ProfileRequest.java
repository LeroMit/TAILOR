package org.tailor.api.tailorback.requests;

import lombok.Data;

import java.util.List;

@Data
public class ProfileRequest {
    private Long tailorId;

    private List<Long> tagIds;
}
