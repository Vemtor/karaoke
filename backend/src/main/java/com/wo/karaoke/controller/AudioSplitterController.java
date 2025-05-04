package com.wo.karaoke.controller;

import com.wo.karaoke.exception.AudioSplitException;
import com.wo.karaoke.service.AudioSplitterService;
import java.io.IOException;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audio")
@AllArgsConstructor
public class AudioSplitterController {
  private final AudioSplitterService audioSplitterService;

  @PostMapping(value = "/split", produces = "application/json")
  public ResponseEntity<Map<String, Object>> splitAudio(@RequestParam String youtubeUrl) {
    try {
      Map<String, Object> result = audioSplitterService.splitAudio(youtubeUrl);
      return ResponseEntity.ok().body(result);
    } catch (Exception e) {
      throw new AudioSplitException("An error occured while running audio splitting script.");
    }
  }

  @GetMapping(value = "/split/{directoryName}/{fileName}", produces = "audio/mpeg")
  public ResponseEntity<FileSystemResource> getAudio(
      @PathVariable String directoryName, @PathVariable String fileName) throws IOException {
    return ResponseEntity.ok().body(audioSplitterService.getAudio(directoryName, fileName));
  }
}
