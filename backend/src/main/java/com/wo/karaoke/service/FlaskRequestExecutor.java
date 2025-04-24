package com.wo.karaoke.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Slf4j
@Service
@AllArgsConstructor
public class FlaskRequestExecutor {
    private final HttpClient httpClient = HttpClient.newBuilder().build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> processAudio(String youtubeUrl, String serverUrl) throws IOException, InterruptedException {
        try {
            String jsonResponse = sendToFlaskServer(youtubeUrl, serverUrl);
            return objectMapper.readValue(jsonResponse, Map.class);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    private String sendToFlaskServer(String youtubeUrl, String serverUrl) throws IOException, InterruptedException {
        String fullUrl = serverUrl + "?youtube_url=" + URLEncoder.encode(youtubeUrl, StandardCharsets.UTF_8);


        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(fullUrl))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();
        log.info("Sending request to " + fullUrl);

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new IOException("Flask server returned error code: " + response.statusCode());
        }

        return response.body();
    }
}
