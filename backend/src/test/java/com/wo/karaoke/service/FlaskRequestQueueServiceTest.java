package com.wo.karaoke.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

public class FlaskRequestQueueServiceTest {
  @Test
  void procesAudioQueued() throws Exception {
    AudioTranscriptionService transcriptionService = Mockito.mock(AudioTranscriptionService.class);

    Map<String, Object> response = new HashMap<>();
    response.put("full_text", "Test transcription");

    when(transcriptionService.processAudio(any(MultipartFile.class))).thenReturn(response);

    FlaskRequestQueueService queueService = new FlaskRequestQueueService(transcriptionService);
    MockMultipartFile testFile =
        new MockMultipartFile("file", "test.mp3", "audio/mpeg", "test audio content".getBytes());

    Map<String, Object> result = queueService.processAudioQueued(testFile);
    assertNotNull(result);
    assertEquals("Test transcription", result.get("full_text"));
  }
}
