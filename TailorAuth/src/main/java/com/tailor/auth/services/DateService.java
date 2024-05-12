package com.tailor.auth.services;

import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class DateService {

    public DateService() {
    }

    public Date getCurrentDate() {
        return new Date();
    }

    public Date getExpirationDate(long expiration) {
        return new Date(System.currentTimeMillis() + expiration);
    }
}
