package org.tailor.api.tailorback.exceptions;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class InternalServerErrorException extends Exception {
    public static final int STATUS = 500;
    private static final String EXCEPTION_MSG = "Internal server error :";

    public InternalServerErrorException() {
        super(EXCEPTION_MSG);
        log.error(EXCEPTION_MSG);
    }

    public InternalServerErrorException(String message) {
        super(message);
        log.error(EXCEPTION_MSG, message);
    }

    public InternalServerErrorException(Throwable cause) {
        super(cause);
        log.error(EXCEPTION_MSG, cause.getMessage(), cause);
    }

    public InternalServerErrorException(String message, Throwable cause) {
        super(message, cause);
        log.error(EXCEPTION_MSG, message, cause);
    }
}
