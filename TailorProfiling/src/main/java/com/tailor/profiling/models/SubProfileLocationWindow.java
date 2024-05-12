package com.tailor.profiling.models;

import java.util.Set;

public class SubProfileLocationWindow extends SubProfile {
    private static final Float KEY_THRESHOLD = 50f;

    public SubProfileLocationWindow() {
        super(KEY_THRESHOLD);
    }

    public SubProfileLocationWindow(Float keyThreshold) {
        super(keyThreshold);
    }

    public SubProfileLocationWindow(Set<KeysSubProfileDefault> data) {
        super(KEY_THRESHOLD, data);
    }

    public SubProfileLocationWindow(Float keyThreshold,
            Set<KeysSubProfileDefault> data) {
        super(keyThreshold, data);
    }

}
