package com.wo.karaoke.controller;

import com.wo.karaoke.service.FlaskRequestQueueService;
import java.util.Map;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/audio")
public class AudioTranscriptionController {
  // receive MP3 files and forward them to model

  @Autowired private FlaskRequestQueueService queueService;

  @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> transcribeAudio(@RequestParam MultipartFile file) {
    try {
      if (file.isEmpty() || !Objects.equals(file.getContentType(), "audio/mpeg")) {
        return ResponseEntity.badRequest().body("Please upload a valid MP3 file");
      }
      Map<String, Object> transcription = queueService.processAudioQueued(file);
      return ResponseEntity.ok().body(transcription);

    } catch (Exception e) {
      return ResponseEntity.internalServerError().body("Error processing audio: " + e.getMessage());
    }
  }
}
