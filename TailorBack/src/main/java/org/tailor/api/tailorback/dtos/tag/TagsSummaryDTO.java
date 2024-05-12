package org.tailor.api.tailorback.dtos.tag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagsSummaryDTO {
    private HashMap<Long, String> tags;
}
