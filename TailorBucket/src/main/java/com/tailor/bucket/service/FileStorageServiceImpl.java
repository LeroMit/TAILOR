package com.tailor.bucket.service;

import com.jlefebure.spring.boot.minio.MinioException;
import com.jlefebure.spring.boot.minio.MinioService;
import com.tailor.bucket.mapper.FileResponseMapper;
import com.tailor.bucket.payload.FileResponse;
import com.tailor.bucket.payload.FileSimpleResponse;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.UUID;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    MinioService minioService;

    FileResponseMapper fileResponseMapper;

    @Override
    public FileSimpleResponse addFile(MultipartFile file) {
        // Path path = Path.of(file.getOriginalFilename());
        UUID randomFilename = UUID.randomUUID();
        if (file.getOriginalFilename() == null || file.getOriginalFilename().isEmpty()) {
            throw new IllegalStateException("File is empty");
        }

        String fileExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
        Path path = Path.of(randomFilename + fileExtension);

        try {
            minioService.upload(path, file.getInputStream(), file.getContentType());

            var metadata = minioService.getMetadata(path);
            log.info("this file {} storage in bucket: {} on date: {}", metadata.name(), metadata.bucketName(),
                    metadata.createdTime());
            log.info("Metadata en entier: " + metadata.toString());
            FileSimpleResponse fileResponse = new FileSimpleResponse(metadata.name());
            return fileResponse;
        } catch (IOException | MinioException ex) {
            throw new IllegalStateException(ex.getMessage());
        }
    }

    @SneakyThrows
    @Override
    public void deleteFile(String filename) {
        Path path = Path.of(filename);
        var metadata = minioService.getMetadata(path);
        minioService.remove(path);
        log.info("this file {} removed in bucket: {} on date: {}", metadata.name(), metadata.bucketName(),
                metadata.createdTime());
    }

    @SneakyThrows
    @Override
    public FileResponse getFile(String filename) {
        Path path = Path.of(filename);
        var metadata = minioService.getMetadata(path);

        InputStream inputStream = minioService.get(path);
        InputStreamResource inputStreamResource = new InputStreamResource(inputStream);

        return FileResponse.builder()
                .filename(metadata.name())
                .fileSize(metadata.length())
                .contentType(metadata.contentType())
                .createdTime(metadata.createdTime())
                .stream(inputStreamResource)
                .build();
    }

    @SneakyThrows
    @Override
    public FileResponse getFileDetails(String fileName) {
        Path path = Path.of(fileName);
        var metadata = minioService.getMetadata(path);
        return fileResponseMapper.fileGetResponse(metadata);
    }
}
