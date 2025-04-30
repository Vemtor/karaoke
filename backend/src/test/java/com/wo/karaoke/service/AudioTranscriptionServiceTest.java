package com.wo.karaoke.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
public class AudioTranscriptionServiceTest {

  @InjectMocks private AudioTranscriptionService audioTranscriptionService;

  @Spy private ObjectMapper objectMapper = new ObjectMapper();

  @Mock private HttpClient httpClient;

  @Mock private HttpResponse<String> httpResponse;

  private static final String TEST_FLASK_URL = "http://localhost:8888/predict";
  private static final String TEST_TRANSCRIPTION_FOLDER = "src/test/resources/transcriptions";

  @BeforeEach
  public void setup() throws IOException {
    ReflectionTestUtils.setField(audioTranscriptionService, "flaskServerUrl", TEST_FLASK_URL);
    ReflectionTestUtils.setField(
        audioTranscriptionService, "transcriptionFolder", TEST_TRANSCRIPTION_FOLDER);
    ReflectionTestUtils.setField(audioTranscriptionService, "httpClient", httpClient);

    Path transcriptionDir = Paths.get(TEST_TRANSCRIPTION_FOLDER);
    if (!Files.exists(transcriptionDir)) {
      Files.createDirectory(transcriptionDir);
    }
  }

  @Test
  public void testProcessAudio_WithSaveJson() throws IOException, InterruptedException {

    MockMultipartFile mockFile = getMockFile();

    // Prepare mock response
    String mockJsonResponse = createMockJsonResponse();
    when(httpResponse.statusCode()).thenReturn(200);
    when(httpResponse.body()).thenReturn(mockJsonResponse);
    when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(httpResponse);

    // Execute service method
    Map<String, Object> result = audioTranscriptionService.processAudio(mockFile);

    // Verify results
    assertNotNull(result);
    assertEquals("This is a test transcription.", result.get("full_text"));

    // Verify JSON file was saved
    File savedJson = new File(TEST_TRANSCRIPTION_FOLDER, "test-audio.json");
    assertTrue(savedJson.exists());

    // Cleanup
    savedJson.delete();
  }

  @Test
  public void processAudio_WhenServerReturnError_ShouldThrowException()
      throws IOException, InterruptedException {
    // Given
    MockMultipartFile mockFile = getMockFile();

    // when & then
    when(httpResponse.statusCode()).thenReturn(500);
    when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenReturn(httpResponse);

    IOException exception =
        assertThrows(IOException.class, () -> audioTranscriptionService.processAudio(mockFile));

    assertTrue(exception.getMessage().contains("500"));
    assertTrue(exception.getMessage().contains("Flask server returned error code: 500"));
  }

  private byte[] getTestAudioBytes() {
    return new byte[] {0x01, 0x02, 0x03, 0x04, 0x05};
  }

  private String createMockJsonResponse() throws IOException {
    Map<String, Object> response = new HashMap<>();
    response.put("full_text", "This is a test transcription.");

    Map<String, Object> segment1 =
        Map.of(
            "start", 0.0,
            "end", 2.5,
            "text", "This is a");

    Map<String, Object> segment2 =
        Map.of(
            "start", 2.5,
            "end", 4.0,
            "text", "test transcription");

    response.put("segments", List.of(segment1, segment2));

    return objectMapper.writeValueAsString(response);
  }

  private MockMultipartFile getMockFile() {
    byte[] audioContent = getTestAudioBytes();
    MockMultipartFile mockFile =
        new MockMultipartFile("file", "test-audio.mp3", "audio/mpeg", audioContent);
    return mockFile;
  }
}
