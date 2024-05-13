package com.tailor.profiling.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.tailor.profiling.models.GraphNode;
import com.tailor.profiling.models.KeysSubProfileDefault;
import com.tailor.profiling.models.Profile;
import com.tailor.profiling.models.SubProfileDefault;

import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@NoArgsConstructor
@Service
public class SerializationService {
    /**
     * Generate a graph representation of the profile
     * 
     * @return {@link List} of {@link GraphNode}
     */
    public List<GraphNode> generateGraphRepresentation(Profile profile) {
        List<GraphNode> graphRepresentation = new ArrayList<>();
        int increment = 0;
        Set<KeysSubProfileDefault> keysSubProfileDefaults = profile.getSummary().getData();
        for (KeysSubProfileDefault keysSubProfileDefault : keysSubProfileDefaults) {
            List<String> keys = keysSubProfileDefault.getKeys();
            SubProfileDefault subProfileDefault = keysSubProfileDefault.getSubProfileDefault();

            // Create nodes for tag scores
            for (HashMap.Entry<Long, Float> entry : subProfileDefault.getTagScores().entrySet()) {
                increment++;
                GraphNode graphNode = new GraphNode(increment, entry.getKey().toString(), "tag", new ArrayList<>(),
                        null);
                graphRepresentation.add(graphNode);
            }

            int firstFilterId = increment + 1;
            int lastFilterId = 0;
            // Create nodes for keys
            for (int i = 0; i < keys.size(); i++) {
                increment++;
                GraphNode graphNode = new GraphNode(increment, keys.get(i), "TO DETER", new ArrayList<>(), null);
                if (i < keys.size() - 1) {
                    graphNode.getChildren().add(increment + 1);
                } else {
                    graphNode.getChildren().add(-1); // Connect last key node to end node
                }
                graphRepresentation.add(graphNode);
                if (i == 0) {
                    lastFilterId = increment;
                }
            }

            // Connect the first tag node to the first key node
            graphRepresentation.get(firstFilterId - 1).getChildren().add(lastFilterId);
        }

        // Add the end node
        GraphNode endGraphNode = new GraphNode(-1, "", "end", new ArrayList<>(), null);
        graphRepresentation.add(endGraphNode);
        return graphRepresentation;
    }

    /**
     * Convert a graph representation to a json string
     * 
     * @param graphRepresentation
     * @return
     */
    public String toJson(List<GraphNode> graphRepresentation) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < graphRepresentation.size(); i++) {
            sb.append(graphRepresentation.get(i).toJson());
            if (i != graphRepresentation.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
