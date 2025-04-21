package com.wo.karaoke.helpers;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;


public class FileHandler {

    public static File convertMultiPartToFile(MultipartFile file) throws IOException {
        File tempFile = new File(System.getProperty("java.io.tmpdir"), UUID.randomUUID().toString() + ".mp3");
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }
        return tempFile;
    }
}
