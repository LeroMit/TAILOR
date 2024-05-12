package com.tailor.bucket.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.core.io.Resource;

import com.tailor.bucket.payload.FileResponse;
import com.tailor.bucket.payload.FileSimpleResponse;
import com.tailor.bucket.service.FileStorageService;

@Slf4j
@Controller
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequestMapping(value = "/v1/files", produces = { "application/json", "application/xml", "application/hal+json" })
@Tag(name = "files", description = "File Service")
public class FileController {

    FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload a File")
    public ResponseEntity<FileSimpleResponse> fileUpload(@RequestPart("file") MultipartFile file) {
        FileSimpleResponse response = fileStorageService.addFile(file);
        log.info("File successfuly uploaded");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/view/{file}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "View a File")
    public ResponseEntity<InputStreamResource> viewFile(@PathVariable String file) {
        FileResponse source = fileStorageService.getFile(file);
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(source.getContentType()))
                .contentLength(source.getFileSize())
                .header("Content-disposition", "attachment; filename=" + source.getFilename())
                .body(source.getStream());
    }

    @GetMapping("/download/{file}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Download a File")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String file) {
        FileResponse source = fileStorageService.getFile(file);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(source.getFileSize())
                .header("Content-disposition", "attachment; filename=" + source.getFilename())
                .body(source.getStream());
    }

    @GetMapping("/stream/{file}")
    @ResponseStatus(HttpStatus.PARTIAL_CONTENT)
    @Operation(summary = "Stream a Video File")
    public ResponseEntity<Resource> streamVideo(@PathVariable String file, HttpServletRequest request) {
        FileResponse source = fileStorageService.getFile(file);

        if (!source.getContentType().startsWith("video/")) {
            throw new IllegalStateException("File is not a video");
        }

        Resource resource = source.getStream();
        long fileSize = source.getFileSize();
        String rangeHeader = request.getHeader("Range");

        if (rangeHeader == null || rangeHeader.equals("bytes=0-" + (fileSize - 1))) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(source.getContentType()))
                    .contentLength(fileSize)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + source.getFilename() + "\"")
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(resource);
        } else {
            HttpRange range = HttpRange.parseRanges(rangeHeader).get(0);
            long start = range.getRangeStart(fileSize);
            long end = range.getRangeEnd(fileSize);
            long rangeLength = end - start + 1;

            InputStream inputStream;
            InputStreamResource inputStreamResource = null;
            try {
                inputStream = resource.getInputStream();

                inputStream.skip(start);

                inputStreamResource = new InputStreamResource(inputStream) {
                    @Override
                    public long contentLength() {
                        return rangeLength;
                    }
                };
            } catch (IOException e) {
                e.printStackTrace();
            }

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(MediaType.parseMediaType(source.getContentType()))
                    .contentLength(rangeLength)
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileSize)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + source.getFilename() + "\"")
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(inputStreamResource);
        }
    }

    @DeleteMapping("/{file}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a File")
    public Object removeFile(@PathVariable String file) {
        fileStorageService.deleteFile(file);
        return ResponseEntity.noContent();
    }

    @GetMapping("/{file}/detail")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get File Detail")
    public ResponseEntity<FileResponse> getFileDetail(@PathVariable String file) {
        FileResponse response = fileStorageService.getFileDetails(file);
        return ResponseEntity.ok(response);
    }
}
