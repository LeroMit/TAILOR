package com.tailor.bucket.error;

import io.minio.errors.MinioException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.tailor.bucket.helper.MediaTypeInfo;

import org.apache.catalina.connector.ClientAbortException;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;

import static org.springframework.http.HttpStatus.*;

@Slf4j
@RestControllerAdvice
public class ErrorHandler {

    @ExceptionHandler({
            IllegalArgumentException.class,
    })
    @ResponseStatus(BAD_REQUEST)
    ResponseEntity<ApiError> handleCustomBadRequestException(Exception ex, HttpServletRequest request) {
        ApiError response = errorDetails(ex.getMessage(), ex, BAD_REQUEST, request);
        return ResponseEntity
                .status(BAD_REQUEST)
                .contentType(getMediaType())
                .body(response);
    }

    @ExceptionHandler({
            MinioException.class,
            InvocationTargetException.class
    })
    @ResponseStatus(NOT_FOUND)
    ResponseEntity<ApiError> handleMinioException(Exception ex, HttpServletRequest request) {
        ApiError response = errorDetails("File Not Found !", ex, NOT_FOUND, request);
        return ResponseEntity
                .status(NOT_FOUND)
                .contentType(getMediaType())
                .body(response);
    }

    @ExceptionHandler({
            IllegalStateException.class,
            IOException.class
    })
    @ResponseStatus(INTERNAL_SERVER_ERROR)
    ResponseEntity<ApiError> handleException(Exception ex, HttpServletRequest request) {
        ApiError response = errorDetails(ex.getMessage(), ex, INTERNAL_SERVER_ERROR, request);
        return ResponseEntity
                .status(INTERNAL_SERVER_ERROR)
                .contentType(getMediaType())
                .body(response);
    }

    @ExceptionHandler({ ClientAbortException.class })
    @ResponseStatus(INTERNAL_SERVER_ERROR)
    ResponseEntity<ApiError> handleClientAbortException(ClientAbortException ex, HttpServletRequest request) {
        ApiError response = errorDetails("Client closed the connection before the video finished streaming.", ex,
                INTERNAL_SERVER_ERROR, request);
        return ResponseEntity
                .status(INTERNAL_SERVER_ERROR)
                .contentType(getMediaType())
                .body(response);
    }

    private MediaType getMediaType() {
        String currentMediaType = MediaTypeInfo.getCurrentMediaType();
        if (currentMediaType != null) {
            switch (currentMediaType) {
                case "hal":
                case "json":
                    return MediaType.APPLICATION_JSON;
                case "xml":
                    return MediaType.APPLICATION_XML;
                default:
                    return MediaType.ALL;
            }
        } else {
            return MediaType.APPLICATION_JSON;
        }
    }

    private ApiError errorDetails(String message, Exception exception, HttpStatus httpStatus,
            HttpServletRequest request) {
        var errorDetail = ApiError.builder()
                .message(message)
                .status(httpStatus.value())
                .timestamp(new Date())
                .error(httpStatus.getReasonPhrase())
                .path(request.getRequestURI().substring(request.getContextPath().length())).build();

        log.error(exception.getMessage());
        return errorDetail;
    }
}