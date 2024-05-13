package com.tailor.profiling.models;

import java.util.List;

import lombok.Data;

/**
 * KeysSubProfileDefault
 */
@Data
public class KeysSubProfileDefault {
    List<String> keys;
    SubProfileDefault subProfileDefault;

    public KeysSubProfileDefault(List<String> keys, SubProfileDefault subProfileDefault) {
        this.keys = keys;
        this.subProfileDefault = subProfileDefault;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof KeysSubProfileDefault)) {
            return false;
        }
        KeysSubProfileDefault keysSubProfileDefault = (KeysSubProfileDefault) obj;
        return keysSubProfileDefault.keys.equals(keys);
    }

    @Override
    public int hashCode() {
        return keys.hashCode();
    }
}