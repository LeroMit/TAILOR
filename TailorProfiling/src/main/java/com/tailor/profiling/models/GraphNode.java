package com.tailor.profiling.models;

import lombok.Data;

import java.util.List;

@Data
public class GraphNode {
    int id;
    String name;
    String type;
    List<Integer> children;
    Float percentage;

    public GraphNode(int id, String name, String type, List<Integer> children, Float percentage) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.children = children;
        this.percentage = percentage;
    }

    public GraphNode(int id, String name, String type, List<Integer> children) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.children = children;
    }

    public String toJson() {
        return "{\"id\":" + id + ",\"name\":\"" + name + "\",\"type\":\"" + type + "\",\"children\":" + children
                + ",\"percentage\":" + percentage + "}";
    }
}