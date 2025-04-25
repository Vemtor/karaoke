package com.wo.karaoke.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FlaskRequestExecutorTest {

    private HttpClient mockHttpClient;
    private ObjectMapper objectMapper;
    private FlaskRequestExecutor flaskRequestExecutor;

    @BeforeEach
    void setUp() {
        mockHttpClient = mock(HttpClient.class);
        objectMapper = new ObjectMapper();
        flaskRequestExecutor = new FlaskRequestExecutor(mockHttpClient, objectMapper);
    }

    @Test
    void testProcessAudio_success() throws Exception {
        String youtubeUrl = "https://youtube.com/example";
        String serverUrl = "http://localhost:5000/process";

        String expectedJson = "{\"vocalsPath\": \"/vocals.wav\", \"instrumentsPath\": \"/instruments.wav\"}";
        HttpResponse<String> mockResponse = mock(HttpResponse.class);

        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn(expectedJson);

        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockResponse);

        Map<String, Object> result = flaskRequestExecutor.processAudio(youtubeUrl, serverUrl);

        assertEquals("/vocals.wav", result.get("vocalsPath"));
        assertEquals("/instruments.wav", result.get("instrumentsPath"));
    }

    @Test
    void testProcessAudio_flaskServerError_throwsIOException() throws Exception {
        String youtubeUrl = "https://youtube.com/example";
        String serverUrl = "http://localhost:5000/process";

        HttpResponse<String> mockResponse = mock(HttpResponse.class);
        when(mockResponse.statusCode()).thenReturn(500);
        when(mockResponse.body()).thenReturn("Internal Server Error");

        when(mockHttpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(mockResponse);

        IOException exception = assertThrows(IOException.class, () ->
                flaskRequestExecutor.processAudio(youtubeUrl, serverUrl)
        );

        assertTrue(exception.getMessage().contains("Flask server returned error code"));
    }

}