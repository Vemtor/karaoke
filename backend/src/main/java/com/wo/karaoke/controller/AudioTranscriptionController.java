package com.wo.karaoke.controller;

import com.wo.karaoke.service.AudioTranscriptionService;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/audio")
public class AudioTranscriptionController {
  // receive MP3 files and forward them to model

  private final AudioTranscriptionService audioTranscriptionService;

  @PostMapping(value = "/transcribe")
  public ResponseEntity<?> transcribeAudio(@RequestParam String youtubeUrl) {
    try {
      Map<String, Object> transcription = audioTranscriptionService.transcribe(youtubeUrl);
      return ResponseEntity.ok().body(transcription);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body("Error processing audio: " + e.getMessage());
    }
  }
}
