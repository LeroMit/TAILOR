package com.tailor.profiling.services;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.net.URL;
import java.net.URI;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.tailor.profiling.models.GraphNode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ConvertService {

    public static enum TimeWindow {
        MONDAY_MORNING,
        MONDAY_AFTERNOON,
        MONDAY_EVENING,
        MONDAY_NIGHT,
        TUESDAY_MORNING,
        TUESDAY_AFTERNOON,
        TUESDAY_EVENING,
        TUESDAY_NIGHT,
        WEDNESDAY_MORNING,
        WEDNESDAY_AFTERNOON,
        WEDNESDAY_EVENING,
        WEDNESDAY_NIGHT,
        THURSDAY_MORNING,
        THURSDAY_AFTERNOON,
        THURSDAY_EVENING,
        THURSDAY_NIGHT,
        FRIDAY_MORNING,
        FRIDAY_AFTERNOON,
        FRIDAY_EVENING,
        FRIDAY_NIGHT,
        SATURDAY_MORNING,
        SATURDAY_AFTERNOON,
        SATURDAY_EVENING,
        SATURDAY_NIGHT,
        SUNDAY_MORNING,
        SUNDAY_AFTERNOON,
        SUNDAY_EVENING,
        SUNDAY_NIGHT;

        public static TimeWindow getDayTimeWindow(int dayOfWeek, int hourOfDay) {
            switch (dayOfWeek) {
                case 1:
                    switch (hourOfDay) {
                        case 0:
                            return MONDAY_NIGHT;
                        case 1:
                            return MONDAY_MORNING;
                        case 2:
                            return MONDAY_AFTERNOON;
                        case 3:
                            return MONDAY_EVENING;
                    }
                    break;
                case 2:
                    switch (hourOfDay) {
                        case 0:
                            return TUESDAY_NIGHT;
                        case 1:
                            return TUESDAY_MORNING;
                        case 2:
                            return TUESDAY_AFTERNOON;
                        case 3:
                            return TUESDAY_EVENING;
                    }
                    break;
                case 3:
                    switch (hourOfDay) {
                        case 0:
                            return WEDNESDAY_NIGHT;
                        case 1:
                            return WEDNESDAY_MORNING;
                        case 2:
                            return WEDNESDAY_AFTERNOON;
                        case 3:
                            return WEDNESDAY_EVENING;
                    }
                    break;
                case 4:
                    switch (hourOfDay) {
                        case 0:
                            return THURSDAY_NIGHT;
                        case 1:
                            return THURSDAY_MORNING;
                        case 2:
                            return THURSDAY_AFTERNOON;
                        case 3:
                            return THURSDAY_EVENING;
                    }
                    break;
                case 5:
                    switch (hourOfDay) {
                        case 0:
                            return FRIDAY_NIGHT;
                        case 1:
                            return FRIDAY_MORNING;
                        case 2:
                            return FRIDAY_AFTERNOON;
                        case 3:
                            return FRIDAY_EVENING;
                    }
                    break;
                case 6:
                    switch (hourOfDay) {
                        case 0:
                            return SATURDAY_NIGHT;
                        case 1:
                            return SATURDAY_MORNING;
                        case 2:
                            return SATURDAY_AFTERNOON;
                        case 3:
                            return SATURDAY_EVENING;
                    }
                    break;
                case 7:
                    switch (hourOfDay) {
                        case 0:
                            return SUNDAY_NIGHT;
                        case 1:
                            return SUNDAY_MORNING;
                        case 2:
                            return SUNDAY_AFTERNOON;
                        case 3:
                            return SUNDAY_EVENING;
                    }
                    break;
            }
            return null;
        }
    }

    /**
     * Convert LocalDateTime to discretised time window within the week
     * 
     * @param dateTimeString
     * @return
     */
    public TimeWindow convertDateTimeToTimeWindow(String dateTimeString) {
        LocalDateTime dateTime = parseDateTime(dateTimeString);
        int dayOfWeek = dateTime.getDayOfWeek().getValue();
        int hourOfDay = dateTime.getHour();
        if (hourOfDay < 7) {
            hourOfDay = 0;
        } else if (hourOfDay < 12) {
            hourOfDay = 1;
        } else if (hourOfDay < 20) {
            hourOfDay = 2;
        } else {
            hourOfDay = 3;
        }
        return TimeWindow.getDayTimeWindow(dayOfWeek, hourOfDay);
    }

    /**
     * Convert LocalDate to String using SimpleDateFormat
     * 
     * @param date
     * @return
     */
    private LocalDateTime parseDateTime(String dateTimeString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        return LocalDateTime.parse(dateTimeString, formatter);
    }

    public String convertLatLngToString(String lat, String lng) {
        String result = "";
        try {
            final String urlString = String.format(
                    "https://nominatim.openstreetmap.org/reverse?lat=%s&lon=%s&addressdetails=0&zoom=5&format=jsonv2",
                    lat, lng);
            URL url = new URI(urlString).toURL();
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            int status = con.getResponseCode();
            if (status == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                result = response.toString();
                JSONObject obj = new JSONObject(result);
                result = obj.getString("name");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result.replace(" ", "_").toUpperCase();
    }

    public HashMap<Long, String> getTags(List<Long> tagIds) {
        log.debug("Getting tags from api");
        HashMap<Long, String> result = new HashMap<>();
        try {
            final String urlString = "http://localhost:8081/api/getTags";
            URL url = new URI(urlString).toURL();
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            JSONArray jsonTagIds = new JSONArray(tagIds);
            String jsonInputString = jsonTagIds.toString();

            try (OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            } catch (Exception e) {
                e.printStackTrace();
            }

            int status = con.getResponseCode();

            if (status == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                JSONObject obj = new JSONObject(response.toString());
                JSONObject tagsObject = obj.getJSONObject("tags");
                for (String key : tagsObject.keySet()) {
                    result.put(Long.parseLong(key), tagsObject.getString(key));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    public List<GraphNode> replaceTagIdsByLabels(List<GraphNode> graph) {
        log.debug("Replacing tag ids by labels");
        graph.forEach(node -> {
            Long tagId = Long.valueOf(node.getId());
            String label = getTags(List.of(tagId)).get(tagId);
            if (label != null) {
                node.setName(label);
            }
        });

        return graph;
    }
}
