package com.tailor.auth.services;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DateServiceTest {

    private final DateService dateService = new DateService();

    @Test
    void testGetCurrentDate() {
        Date currentDate = dateService.getCurrentDate();
        assertNotNull(currentDate);
    }

    @Test
    void testGetExpirationDate() {
        long expiration = 3600000; // 1 hour in milliseconds
        Date expirationDate = dateService.getExpirationDate(expiration);
        assertNotNull(expirationDate);

        Date currentDate = new Date();
        assertTrue(expirationDate.after(currentDate));
    }
}