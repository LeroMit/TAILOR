package com.tailor.profiling.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Profiling made on the Tailor
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "profiles")
public class Profile {
    @Id
    public String _tailorId;

    public SubProfileDefault defaults;
    public SubProfileLocationWindow subProfileLocationWindow;
    public SubProfileTimeWindow subProfileTimeWindow;
    public SubProfile summary;

    public Profile(String tailorId) {
        this._tailorId = tailorId;
        this.defaults = new SubProfileDefault();
        this.subProfileLocationWindow = new SubProfileLocationWindow();
        this.subProfileTimeWindow = new SubProfileTimeWindow();
        this.summary = new SubProfile(0F);
    }
}
