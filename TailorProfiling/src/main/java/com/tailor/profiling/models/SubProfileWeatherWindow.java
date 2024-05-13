package com.tailor.profiling.models;

import java.util.Set;

public class SubProfileWeatherWindow extends SubProfile {
    private static final Float KEY_THRESHOLD = 0.5f;

    public SubProfileWeatherWindow() {
        super(KEY_THRESHOLD);
    }

    public SubProfileWeatherWindow(Float keyThreshold) {
        super(keyThreshold);
    }

    public SubProfileWeatherWindow(Set<KeysSubProfileDefault> data) {
        super(KEY_THRESHOLD, data);
    }

    public SubProfileWeatherWindow(Float keyThreshold,
            Set<KeysSubProfileDefault> data) {
        super(keyThreshold, data);
    }

}
