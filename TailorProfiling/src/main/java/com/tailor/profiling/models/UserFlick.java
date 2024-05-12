package com.tailor.profiling.models;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class UserFlick {
    private String localisation;
    private String timeWindow;
    private Integer score;
    private List<Long> tags;
}
