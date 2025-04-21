package com.wo.karaoke.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wo.karaoke.helpers.FileHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AudioTranscriptionService {


    @Value("${flask.server.url}")
    private String flaskServerUrl;

    @Value("${transcription.folder:transcriptions}")
    private String transcriptionFolder;

    private final HttpClient httpClient = HttpClient.newBuilder().build();
    private final ObjectMapper objectMapper = new ObjectMapper();


    public Map<String, Object> processAudio(MultipartFile file, boolean saveJson) throws IOException, InterruptedException {
        File tempFile = FileHandler.convertMultiPartToFile(file);
        try {
            String jsonResponse = sendToFlaskServer(tempFile);
            Map<String, Object> transcription = objectMapper.readValue(jsonResponse, Map.class);
            if (saveJson) {
                saveTranscriptionToJson(file.getOriginalFilename(), transcription);
            }
            return transcription;
        } finally {
            if (tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

    private void saveTranscriptionToJson(String originalFilename, Map<String, Object> transcription) throws IOException {
        Path transcriptionsDir = Paths.get(transcriptionFolder);
        if (!Files.exists(transcriptionsDir)) {
            Files.createDirectory(transcriptionsDir);
        }

        // Generate output filename from original filename
        String baseName = originalFilename;
        if (baseName.toLowerCase().endsWith(".mp3")) {
            baseName = baseName.substring(0, baseName.length() - 4);
        }

        // Remove any problematic characters from filename
        baseName = baseName.replaceAll("[^a-zA-Z0-9-_.]", "_");

        File outputFile = new File(transcriptionsDir.toFile(), baseName + ".json");

        objectMapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, transcription);
    }


    private String sendToFlaskServer(File file) throws IOException, InterruptedException {
        String boundary = UUID.randomUUID().toString();
        byte[] fileBytes = Files.readAllBytes(file.toPath());

        String boundaryPrefix = "--" + boundary;
        String lineFeed = "\r\n";

        String requestBody = boundaryPrefix + lineFeed +
                "Content-Disposition: form-data; name=\"file\"; filename=\"" + file.getName() + "\"" + lineFeed +
                "Content-Type: audio/mpeg" + lineFeed +
                lineFeed;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(flaskServerUrl))
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArrays(List.of(
                        requestBody.getBytes(),
                        fileBytes,
                        (lineFeed + boundaryPrefix + "--" + lineFeed).getBytes()
                )))
                .build();


        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new IOException("Flask server returned error code: " + response.statusCode());
        }

        return response.body();
    }


}
