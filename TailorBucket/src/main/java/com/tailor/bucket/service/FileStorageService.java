package com.tailor.bucket.service;

import org.springframework.web.multipart.MultipartFile;

import com.tailor.bucket.payload.FileResponse;
import com.tailor.bucket.payload.FileSimpleResponse;

public interface FileStorageService {

    FileSimpleResponse addFile(MultipartFile multipartFile);

    void deleteFile(String fileName);

    FileResponse getFile(String fileName);

    FileResponse getFileDetails(String fileName);
}
