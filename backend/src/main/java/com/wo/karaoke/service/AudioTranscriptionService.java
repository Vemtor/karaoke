package com.wo.karaoke.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class AudioTranscriptionService {

    private final FlaskRequestQueueService flaskRequestQueueService;
    @Value("${flask.server.transcription.url}")
    private String flaskServerTranscriptionUrl;

    public AudioTranscriptionService(FlaskRequestQueueService flaskRequestQueueService) {
        this.flaskRequestQueueService = flaskRequestQueueService;
    }

    public Map<String, Object> transcribe(String youtubeUrl) throws Exception {
        return flaskRequestQueueService.queueFlaskRequest(youtubeUrl, flaskServerTranscriptionUrl);
    }
}
