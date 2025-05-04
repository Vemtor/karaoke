package com.wo.karaoke.service;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class FlaskRequestQueueServiceTest {
    @Test
    void procesAudioQueued() throws Exception {
        FlaskRequestExecutor executor = mock(FlaskRequestExecutor.class);

        Map<String, Object> response = new HashMap<>();
        response.put("full_text", "Test transcription");

        FlaskRequestQueueService queueService = new FlaskRequestQueueService(executor);
        String serverUrl = "http://localhost:8889/transcribe";
        String ytUrl = "https://www.youtube.com/watch?v=DWqrqeZCC4E";

        when(executor.processAudio(ytUrl, serverUrl)).thenReturn(response);

        Map<String, Object> result = queueService.queueFlaskRequest(ytUrl, serverUrl);
        assertNotNull(result);
        assertEquals("Test transcription", result.get("full_text"));
    }
}
