package com.wo.karaoke.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

@Service
public class AudioSplitterService {
  private final FlaskRequestExecutor flaskRequestExecutor;

  @Value("${resources.directory}")
  private String songDirectory;

  @Value("${flask.server.splitter.url}")
  private String flaskSplitUrl;

  public AudioSplitterService(FlaskRequestExecutor flaskRequestExecutor) {
    this.flaskRequestExecutor = flaskRequestExecutor;
  }

  public Map<String, Object> splitAudio(String youtubeUrl)
      throws IOException, InterruptedException {
    return flaskRequestExecutor.processAudio(youtubeUrl, flaskSplitUrl);
  }

  public FileSystemResource getAudio(String directoryName, String fileName) throws IOException {
    File file = new File(songDirectory + directoryName, fileName);

    if (!file.exists()) {
      throw new FileNotFoundException(String.format("%s not found", fileName));
    }
    return new FileSystemResource(file);
  }
}
