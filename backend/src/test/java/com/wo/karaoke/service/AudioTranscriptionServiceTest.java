package com.wo.karaoke.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class AudioTranscriptionServiceTest {

    private final String FLASK_URL = "http://localhost:5000/transcribe";
    private FlaskRequestExecutor flaskRequestExecutor;
    private AudioTranscriptionService audioTranscriptionService;

    @BeforeEach
    void setUp() {
        flaskRequestExecutor = mock(FlaskRequestExecutor.class);
        audioTranscriptionService = new AudioTranscriptionService(flaskRequestExecutor);

        ReflectionTestUtils.setField(audioTranscriptionService, "flaskServerTranscriptionUrl", FLASK_URL);
    }

    @Test
    void testTranscribe_returnsExpectedMap() throws Exception {
        String youtubeUrl = "https://youtube.com/watch?v=test";
        Map<String, Object> mockResponse = Map.of("text", "Transcribed content");

        when(flaskRequestExecutor.processAudio(youtubeUrl, FLASK_URL)).thenReturn(mockResponse);

        Map<String, Object> result = audioTranscriptionService.transcribe(youtubeUrl);

        assertEquals("Transcribed content", result.get("text"));
        verify(flaskRequestExecutor, times(1)).processAudio(youtubeUrl, FLASK_URL);
    }

    @Test
    void testTranscribe_throwsIOException() throws Exception {
        String youtubeUrl = "https://youtube.com/watch?v=test";

        when(flaskRequestExecutor.processAudio(any(), any())).thenThrow(new IOException("Test IO exception"));

        IOException exception = assertThrows(IOException.class, () ->
                audioTranscriptionService.transcribe(youtubeUrl));

        assertEquals("Test IO exception", exception.getMessage());
    }

    @Test
    void testTranscribe_throwsInterruptedException() throws Exception {
        String youtubeUrl = "https://youtube.com/watch?v=test";

        when(flaskRequestExecutor.processAudio(any(), any())).thenThrow(new InterruptedException("Interrupted"));

        InterruptedException exception = assertThrows(InterruptedException.class, () ->
                audioTranscriptionService.transcribe(youtubeUrl));

        assertEquals("Interrupted", exception.getMessage());
    }
}
