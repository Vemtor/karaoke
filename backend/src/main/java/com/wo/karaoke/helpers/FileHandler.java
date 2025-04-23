package com.wo.karaoke.helpers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public class FileHandler {

  public static File convertMultiPartToFile(MultipartFile file) throws IOException {
    File tempFile = new File(System.getProperty("java.io.tmpdir"), UUID.randomUUID() + ".mp3");
    try (FileOutputStream fos = new FileOutputStream(tempFile)) {
      fos.write(file.getBytes());
    }
    return tempFile;
  }
}
