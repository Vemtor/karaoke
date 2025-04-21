package com.wo.karaoke.helpers;

import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Arrays;


public class CachedMultipartFile implements MultipartFile {
    private final String name;
    private final String originalFilename;
    private final String contentType;
    private final byte[] content;

    public CachedMultipartFile(MultipartFile file) throws IOException {
        this.name = file.getName();
        this.originalFilename = file.getOriginalFilename();
        this.contentType = file.getContentType();
        this.content = file.getBytes();
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getOriginalFilename() {
        return originalFilename;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public boolean isEmpty() {
        return content.length == 0;
    }

    @Override
    public long getSize() {
        return content.length;
    }

    @Override
    public byte[] getBytes() {
        return Arrays.copyOf(content, content.length);
    }

    @Override
    public InputStream getInputStream() {
        return new ByteArrayInputStream(content);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        Files.write(dest.toPath(), content);
    }
}