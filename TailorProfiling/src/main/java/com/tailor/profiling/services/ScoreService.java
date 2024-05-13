package com.tailor.profiling.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tailor.profiling.models.UserFlick;
import com.tailor.profiling.requests.UserFlickRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ScoreService {
    private static final int MAX_SCORE = 100;
    private static final int MIN_SCORE = 0;

    @Autowired
    private ConvertService convertService;

    public UserFlick calculateScore(UserFlickRequest userFlickRequest) {
        UserFlick result = new UserFlick();
        List<Long> listTags = userFlickRequest.getTagIds();
        result.setTags(listTags);
        result.setTimeWindow(convertService.convertDateTimeToTimeWindow(userFlickRequest.getWatchedAt()).toString());
        result.setLocalisation(
                convertService.convertLatLngToString(userFlickRequest.getLatitude(), userFlickRequest.getLongitude()));

        log.debug("Calculating score of " + userFlickRequest.toString());
        int score = 0;

        if (userFlickRequest.getIsYay() || userFlickRequest.getIsNay()) {
            if (userFlickRequest.getIsYay()) {
                score = MAX_SCORE;
            } else if (userFlickRequest.getIsNay()) {
                score = MIN_SCORE;
            }
        } else {
            // Watch Time
            if (userFlickRequest.getWatchedDuring() < 1.0) {
                score = score + (int) (userFlickRequest.getWatchedDuring() * 30);
            } else {
                score = score + 30;
            }

            // Shared
            if (userFlickRequest.getIsShared()) {
                score = score + 30;
            }

            // Liked
            if (userFlickRequest.getIsLiked()) {
                score = score + 30;
            }
        }

        if (score > MAX_SCORE) {
            score = MAX_SCORE;
        } else if (score < MIN_SCORE) {
            score = MIN_SCORE;
        }

        result.setScore(score);
        return result;
    }

    public List<UserFlick> calculateScore(List<UserFlickRequest> userFlickRequests) {
        return userFlickRequests.stream().map(this::calculateScore).toList();
    }
}
