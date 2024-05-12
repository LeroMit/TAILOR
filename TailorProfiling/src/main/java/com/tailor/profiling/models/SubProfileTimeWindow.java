package com.tailor.profiling.models;

import java.util.Set;

public class SubProfileTimeWindow extends SubProfile {
    private static final Float KEY_THRESHOLD = 50f;

    public SubProfileTimeWindow() {
        super(KEY_THRESHOLD);
    }

    public SubProfileTimeWindow(Float keyThreshold) {
        super(keyThreshold);
    }

    public SubProfileTimeWindow(Set<KeysSubProfileDefault> data) {
        super(KEY_THRESHOLD, data);
    }

    public SubProfileTimeWindow(Float keyThreshold,
            Set<KeysSubProfileDefault> data) {
        super(keyThreshold, data);
    }

}
